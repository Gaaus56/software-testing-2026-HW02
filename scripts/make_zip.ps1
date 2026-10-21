# Đóng gói bài nộp: <MSSV>_HW02_AI_DomainTesting_<Điểm>.zip (đặt cạnh thư mục repo)
# Cách dùng (PowerShell, ở thư mục gốc repo):  .\scripts\make_zip.ps1 -Grade 085
param([Parameter(Mandatory = $true)][ValidatePattern('^\d{3}$')][string]$Grade)

$repo = Resolve-Path (Join-Path $PSScriptRoot "..")
$name = "23120017_HW02_AI_DomainTesting_$Grade"
$stage = Join-Path $env:TEMP $name
$zip = Join-Path (Split-Path $repo -Parent) "$name.zip"

if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory $stage | Out-Null

$items = @("README.md", "git_log.txt", "reports", "bugs", "evidence", "test-data", "testcases", "ai", "pdf", "skills", ".claude")
foreach ($i in $items) {
  $src = Join-Path $repo $i
  if (Test-Path $src) { Copy-Item $src -Destination $stage -Recurse -Force } else { Write-Warning "Thiếu: $i" }
}
# scripts: bỏ node_modules
New-Item -ItemType Directory (Join-Path $stage "scripts") | Out-Null
Get-ChildItem (Join-Path $repo "scripts") -Exclude "node_modules" | Copy-Item -Destination (Join-Path $stage "scripts") -Recurse -Force
Get-ChildItem $stage -Recurse -Filter ".gitkeep" | Remove-Item -Force

if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zip
$mb = [math]::Round((Get-Item $zip).Length / 1MB, 2)
Write-Output "Đã tạo $zip ($mb MB)"
if ($mb -gt 20) { Write-Warning "Vượt 20 MB — cần chia nhỏ (split-zip) theo quy định Moodle" }
