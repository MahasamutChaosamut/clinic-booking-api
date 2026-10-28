# Shows a Windows toast with today's task from PLAN.md.
# Registered as the "Clinic Booking API - Daily Plan" scheduled task (20:00 daily).
# Pass -Date yyyy-MM-dd to preview another day's toast.
param([string]$Date = (Get-Date).ToString('yyyy-MM-dd'))
$ErrorActionPreference = 'Stop'

$planPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'PLAN.md'
$lines = Get-Content -Path $planPath -Encoding UTF8

# Matches "- [ ] **Day 1** · 2026-10-29 — topic"; separators kept as \S+ so this file stays ASCII for PowerShell 5.1.
$pattern = '^- \[( |x)\] \*\*Day (\d+)\*\* \S+ (\d{4}-\d{2}-\d{2}) \S+ (.+)$'
$tasks = $lines | Where-Object { $_ -match $pattern } | ForEach-Object {
    $null = $_ -match $pattern
    [pscustomobject]@{ Done = $Matches[1] -eq 'x'; Day = [int]$Matches[2]; Date = $Matches[3]; Topic = $Matches[4] }
}

$task = $tasks | Where-Object { $_.Date -eq $Date } | Select-Object -First 1
if (-not $task) { exit 0 }

$doneCount = @($tasks | Where-Object { $_.Done }).Count
$behind = @($tasks | Where-Object { -not $_.Done -and $_.Day -lt $task.Day }).Count

$title = "Day $($task.Day)/30 - Clinic Booking API"
$body = $task.Topic
$footer = "Done $doneCount/30"
if ($behind -gt 0) { $footer += " | Behind: $behind day(s)" }

[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

$esc = { param($s) [System.Security.SecurityElement]::Escape($s) }
$xml = New-Object Windows.Data.Xml.Dom.XmlDocument
$xml.LoadXml(@"
<toast scenario="reminder" activationType="protocol" launch="$(& $esc ([Uri]$planPath).AbsoluteUri)">
  <visual>
    <binding template="ToastGeneric">
      <text>$(& $esc $title)</text>
      <text>$(& $esc $body)</text>
      <text>$(& $esc $footer)</text>
    </binding>
  </visual>
  <actions>
    <action content="Open plan" activationType="protocol" arguments="$(& $esc ([Uri]$planPath).AbsoluteUri)" />
    <action content="Dismiss" activationType="system" arguments="dismiss" />
  </actions>
</toast>
"@)

$appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show(
    [Windows.UI.Notifications.ToastNotification]::new($xml))
