Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   TEST DE PERFORMANCE API" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$totalRequests = 50
$successCount = 0
$failCount = 0
$responseTimes = @()

Write-Host "Début du test de $totalRequests requêtes..." -ForegroundColor Yellow
Write-Host ""

for ($i = 1; $i -le $totalRequests; $i++) {
    $body = @{
        firstName = "Performance$i"
        lastName = "Test$i"
        email = "perf$i@test.com"
        phone = "0612345678"
        position = "Dev"
        experience = 3
        skills = @("Node.js", "PowerShell")
    } | ConvertTo-Json

    $startTime = Get-Date
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/candidates" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        $endTime = Get-Date
        $duration = [math]::Round(($endTime - $startTime).TotalMilliseconds, 2)
        
        $successCount++
        $responseTimes += $duration
        
        Write-Host "  [$i/$totalRequests] ✓ Succès - ${duration}ms" -ForegroundColor Green
    }
    catch {
        $failCount++
        Write-Host "  [$i/$totalRequests] ✗ Échec" -ForegroundColor Red
    }
    
    # Pause entre les requêtes
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "        RÉSULTATS DU TEST" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$successRate = [math]::Round(($successCount / $totalRequests) * 100, 2)

Write-Host "📊 Statistiques générales :" -ForegroundColor Yellow
Write-Host "  ▪ Requêtes totales : $totalRequests"
Write-Host "  ▪ Requêtes réussies : $successCount"
Write-Host "  ▪ Requêtes échouées : $failCount"
Write-Host "  ▪ Taux de réussite : $successRate%"
Write-Host ""

if ($responseTimes.Count -gt 0) {
    $avgTime = [math]::Round(($responseTimes | Measure-Object -Average).Average, 2)
    $maxTime = [math]::Round(($responseTimes | Measure-Object -Maximum).Maximum, 2)
    $minTime = [math]::Round(($responseTimes | Measure-Object -Minimum).Minimum, 2)
    
    Write-Host "⏱️  Temps de réponse :" -ForegroundColor Yellow
    Write-Host "  ▪ Moyen : ${avgTime}ms"
    Write-Host "  ▪ Minimum : ${minTime}ms"
    Write-Host "  ▪ Maximum : ${maxTime}ms"
    Write-Host ""
    
    # Vérifier les seuils
    if ($avgTime -lt 500) {
        Write-Host "✅ TEMPS MOYEN : OK (< 500ms)" -ForegroundColor Green
    } else {
        Write-Host "❌ TEMPS MOYEN : TROP ÉLEVÉ (> 500ms)" -ForegroundColor Red
    }
    
    if ($successRate -gt 99) {
        Write-Host "✅ TAUX DE RÉUSSITE : OK (> 99%)" -ForegroundColor Green
    } else {
        Write-Host "❌ TAUX DE RÉUSSITE : TROP BAS (< 99%)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "         TEST TERMINÉ" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
