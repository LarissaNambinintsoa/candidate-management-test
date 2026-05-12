Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   TEST DE PERFORMANCE API" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$totalRequests = 10
$successCount = 0
$failCount = 0
$responseTimes = @()

Write-Host "Début du test de $totalRequests requêtes..." -ForegroundColor Yellow
Write-Host ""

for ($i = 1; $i -le $totalRequests; $i++) {
    # Format JSON correct pour l'API
    $body = @{
        firstName = "Test$i"
        lastName = "User$i"
        email = "test$i@example.com"
        phone = "0612345678"
        position = "Développeur"
        experience = 3
        skills = @("JavaScript", "Node.js")
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
        $errorMsg = $_.Exception.Message
        Write-Host "  [$i/$totalRequests] ✗ Échec - $errorMsg" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "        RÉSULTATS DU TEST" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$successRate = [math]::Round(($successCount / $totalRequests) * 100, 2)

Write-Host "📊 Statistiques générales :" -ForegroundColor Yellow
Write-Host "  Requêtes totales : $totalRequests"
Write-Host "  Requêtes réussies : $successCount"
Write-Host "  Requêtes échouées : $failCount"
Write-Host "  Taux de réussite : $successRate%"
Write-Host ""

if ($responseTimes.Count -gt 0) {
    $avgTime = [math]::Round(($responseTimes | Measure-Object -Average).Average, 2)
    $maxTime = [math]::Round(($responseTimes | Measure-Object -Maximum).Maximum, 2)
    $minTime = [math]::Round(($responseTimes | Measure-Object -Minimum).Minimum, 2)
    
    Write-Host "⏱️ Temps de réponse :" -ForegroundColor Yellow
    Write-Host "  Moyen : ${avgTime}ms"
    Write-Host "  Minimum : ${minTime}ms"
    Write-Host "  Maximum : ${maxTime}ms"
    Write-Host ""
    
    if ($avgTime -lt 500) {
        Write-Host "✅ TEMPS MOYEN : OK (< 500ms)" -ForegroundColor Green
    } else {
        Write-Host "❌ TEMPS MOYEN : TROP ÉLEVÉ (> 500ms)" -ForegroundColor Red
    }
    
    if ($successRate -eq 100) {
        Write-Host "✅ TAUX DE RÉUSSITE : PARFAIT (100%)" -ForegroundColor Green
    } elseif ($successRate -gt 99) {
        Write-Host "✅ TAUX DE RÉUSSITE : OK (> 99%)" -ForegroundColor Green
    } else {
        Write-Host "❌ TAUX DE RÉUSSITE : TROP BAS (< 99%)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
