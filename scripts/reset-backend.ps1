# Khởi động lại backend EShop. Backend tự xóa và seed lại DB mỗi lần khởi động,
# nên script này cũng là cách reset dữ liệu trước mỗi nhóm test case.
# Giả định thư mục: HW02/eshop-sut (SUT) nằm cạnh HW02/software-testing-2026-HW02 (repo này).
$ErrorActionPreference = "SilentlyContinue"
$backend = Resolve-Path (Join-Path $PSScriptRoot "..\..\eshop-sut\backend")

$conns = Get-NetTCPConnection -LocalPort 3000 -State Listen
foreach ($c in $conns) {
  $p = Get-CimInstance Win32_Process -Filter "ProcessId=$($c.OwningProcess)"
  if ($p.CommandLine -like "*server.js*") { Stop-Process -Id $c.OwningProcess -Force }
}
Start-Sleep -Milliseconds 700

$log = Join-Path $env:TEMP "eshop-backend.log"
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $backend -WindowStyle Hidden -RedirectStandardOutput $log -RedirectStandardError "$log.err"
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Milliseconds 300
  try {
    $r = Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/products -TimeoutSec 2
    if ($r.StatusCode -eq 200) { Write-Output "backend ready"; exit 0 }
  } catch {}
}
Write-Output "backend NOT ready"; exit 1
