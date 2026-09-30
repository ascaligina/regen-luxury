<#
  passaggi.ps1 - Passaggi 1-8 in PowerShell (per il PC Windows), dalla cartella backend.
  Stessi controlli di "npm run passaggi" (versione Node, consigliata anche su Windows).

  Uso (server avviato con "npm run dev"):
    Set-ExecutionPolicy -Scope Process Bypass
    .\scripts\passaggi.ps1 -Email admin@esempio.it
    .\scripts\passaggi.ps1 -Email admin@esempio.it -Passaggio 7
#>
param(
    [Parameter(Mandatory = $true)][string]$Email,
    [int]$Passaggio = 0,
    [string]$BaseUrl = "http://localhost:5001/api",
    [string]$TagId = "NFC-001",
    [string]$Password = ""   # se vuoto viene chiesta in modo nascosto
)

$ErrorActionPreference = "Stop"
$script:Falliti = 0
$script:Token = $null

function Invoke-Api {
    param([string]$Method, [string]$Path, $Body = $null, [switch]$Anonimo)
    $params = @{ Method = $Method; Uri = "$BaseUrl$Path"; ContentType = "application/json; charset=utf-8" }
    if ($script:Token -and -not $Anonimo) { $params.Headers = @{ Authorization = "Bearer $($script:Token)" } }
    if ($null -ne $Body) { $params.Body = [System.Text.Encoding]::UTF8.GetBytes(($Body | ConvertTo-Json -Depth 10)) }
    Invoke-RestMethod @params
}

function Get-StatusCode($ErrorRecord) {
    try { return [int]$ErrorRecord.Exception.Response.StatusCode.value__ } catch { return $null }
}

function Titolo([int]$n, [string]$testo) { Write-Host ""; Write-Host ("=== PASSAGGIO {0} - {1} ===" -f $n, $testo) -ForegroundColor Cyan }

function Verifica([bool]$condizione, [string]$messaggio) {
    if ($condizione) { Write-Host "  [OK]   $messaggio" -ForegroundColor Green }
    else { Write-Host "  [FAIL] $messaggio" -ForegroundColor Red; $script:Falliti++ }
}

function Get-IdCapo { (Invoke-Api GET "/items/tag/$TagId")._id }

function Passaggio1 {
    Titolo 1 "Health check del server"
    $r = Invoke-Api GET "/health"
    Verifica ($r.stato -eq "online") "Server attivo (blockchain: $($r.blockchain))"
}

function Passaggio2 {
    Titolo 2 "Creazione identita digitale del capo + associazione tag $TagId"
    try { $esistente = Invoke-Api GET "/items/tag/$TagId" } catch { $esistente = $null }
    if ($esistente) { Write-Host "  [INFO] Il capo con $TagId esiste gia: creazione saltata" -ForegroundColor Yellow; return }
    $body = @{ brand = "Gucci"; codiceModello = "GG-2024"; materialiOriginari = "Pelle e cotone"; filieraProvenienza = "Italia"; categoria = "giacca"; tagId = $TagId }
    $r = Invoke-Api POST "/items" $body
    Verifica ($r.tagId -eq $TagId) "Capo creato: id $($r._id)"
}

function Passaggio3 {
    Titolo 3 "Registrazione evento di rigenerazione"
    $body = @{ tipo = "upcycling"; descrizione = "Rifoderatura interna e sostituzione bottoni"; materialiNuovi = "Cotone riciclato certificato"; operatore = "Laboratorio Bari" }
    $r = Invoke-Api POST "/items/$(Get-IdCapo)/eventi" $body
    Verifica (@($r.storicoRigenerazione).Count -ge 1) "Evento registrato, eventi totali: $(@($r.storicoRigenerazione).Count)"
}

function Passaggio4 {
    Titolo 4 "Lettura del singolo capo per ID"
    $r = Invoke-Api GET "/items/$(Get-IdCapo)"
    Verifica ($r.tagId -eq $TagId) "Dettaglio letto: $($r.brand) $($r.codiceModello)"
}

function Passaggio5 {
    Titolo 5 "Passaggio di proprieta"
    $r = Invoke-Api POST "/items/$(Get-IdCapo)/proprieta" @{ proprietario = "Maria Rossi" }
    Verifica (@($r.passaggiProprieta).Count -ge 1) "Catena di $(@($r.passaggiProprieta).Count) proprietari"
}

function Passaggio6 {
    Titolo 6 "Verifica pubblica (senza login)"
    $r = Invoke-Api GET "/verify/$TagId" -Anonimo
    Verifica ($null -ne $r.certificatoAutenticita) "Certificato ricevuto"
    $nomi = (@($r.capo.passaggiProprieta) | ForEach-Object proprietario) -join " -> "
    Verifica (-not (($r | ConvertTo-Json -Depth 10) -match "Rossi")) "Nomi minimizzati (GDPR): $nomi"
}

function Passaggio7 {
    Titolo 7 "Anti-replay: rifiuto del tag duplicato $TagId"
    $codice = $null
    try { Invoke-Api POST "/items" @{ brand = "Prada"; codiceModello = "PR-999"; materialiOriginari = "Nylon"; tagId = $TagId } | Out-Null } catch { $codice = Get-StatusCode $_ }
    Verifica ($codice -eq 409) "Tag duplicato rifiutato: HTTP $codice (atteso 409)"
    $codice = $null
    try { Invoke-Api GET "/verify/TAG-INESISTENTE-999" -Anonimo | Out-Null } catch { $codice = Get-StatusCode $_ }
    Verifica ($codice -eq 404) "Tag mai registrato: HTTP $codice (atteso 404)"
    $codice = $null
    try { Invoke-Api POST "/items" @{ brand = "X"; codiceModello = "Y"; materialiOriginari = "Z"; tagId = "NFC-XYZ" } -Anonimo | Out-Null } catch { $codice = Get-StatusCode $_ }
    Verifica ($codice -eq 401) "Creazione senza login rifiutata: HTTP $codice (atteso 401)"
}

function Passaggio8 {
    Titolo 8 "Verifica finale completa dei dati"
    for ($i = 0; $i -lt 20; $i++) {
        $r = Invoke-Api GET "/verify/$TagId" -Anonimo
        if ($r.certificatoAutenticita.integrita.stato -ne "in_attesa") { break }
        Start-Sleep -Milliseconds 500
    }
    $c = $r.certificatoAutenticita
    Verifica ($c.autentico -eq $true) "autentico = $($c.autentico)"
    Verifica ($c.integrita.stato -eq "verificato") "integrita = $($c.integrita.stato) ($($c.integrita.messaggio))"
    if ($c.integrita.stato -in @("incompleto", "non_registrato")) { Write-Host "  [INFO] Esegui 'npm run migra' e ripeti il passaggio 8" -ForegroundColor Yellow }
    Verifica (@($r.capo.storicoRigenerazione).Count -ge 1) "Eventi di rigenerazione: $(@($r.capo.storicoRigenerazione).Count)"
    Verifica (@($r.capo.passaggiProprieta).Count -ge 1) "Passaggi di proprieta: $(@($r.capo.passaggiProprieta).Count)"
}

if ($Password) { $password = $Password } else {
    $sicura = Read-Host "Password per $Email" -AsSecureString
    $password = [System.Net.NetworkCredential]::new("", $sicura).Password
}
try {
    $login = Invoke-Api POST "/auth/login" @{ email = $Email; password = $password } -Anonimo
    $script:Token = $login.token
    Write-Host "Accesso effettuato come $($login.utente.nome) ($($login.utente.ruolo))" -ForegroundColor Green
} catch {
    Write-Host "Login fallito: HTTP $(Get-StatusCode $_)" -ForegroundColor Red; exit 1
}

$daEseguire = if ($Passaggio -gt 0) { @($Passaggio) } else { 1..8 }
foreach ($n in $daEseguire) {
    try { & "Passaggio$n" } catch { Write-Host "  [ERRORE] $($_.Exception.Message)" -ForegroundColor Red; $script:Falliti++ }
}
Write-Host ""
if ($script:Falliti -eq 0) { Write-Host "TUTTI I CONTROLLI SUPERATI" -ForegroundColor Green } else { Write-Host "CONTROLLI FALLITI: $script:Falliti" -ForegroundColor Red; exit 1 }
