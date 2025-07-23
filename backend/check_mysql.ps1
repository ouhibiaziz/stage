if (Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue) {
    Write-Output "MySQL service found. Checking status..."
    Get-Service -Name "MySQL*" | Format-Table Name, Status
} else {
    Write-Output "MySQL service not found. Please ensure MySQL is installed and running."
}
