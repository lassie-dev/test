<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autorización Redes Sociales - {{ $contract->contract_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.5;
            color: #333;
            padding: 30px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .header h1 {
            color: #1e40af;
            font-size: 20px;
            margin-bottom: 5px;
        }
        .contract-ref {
            background: #f1f5f9;
            padding: 8px 15px;
            margin-bottom: 20px;
            border-left: 4px solid #1e40af;
        }
        .section {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
        }
        .section-title {
            color: #1e40af;
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 12px;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 5px;
        }
        .info-row {
            display: flex;
            margin-bottom: 7px;
        }
        .info-label {
            font-weight: bold;
            width: 150px;
            color: #475569;
        }
        .checkbox-group {
            margin: 10px 0;
        }
        .checkbox-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            padding: 8px;
            background: #f8fafc;
        }
        .checkbox {
            width: 15px;
            height: 15px;
            border: 2px solid #64748b;
            display: inline-block;
            margin-right: 10px;
        }
        .legal-text {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 10px;
        }
        .legal-text ul {
            margin-left: 20px;
            margin-top: 10px;
        }
        .legal-text li {
            margin-bottom: 5px;
        }
        .signature-section {
            margin-top: 50px;
        }
        .signature-box {
            margin-bottom: 60px;
        }
        .signature-line {
            border-top: 2px solid #000;
            margin-top: 50px;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 9px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>AUTORIZACIÓN PUBLICACIÓN EN REDES SOCIALES</h1>
        <p style="color: #64748b; margin-top: 5px;">Servicios Funerarios</p>
    </div>

    <!-- Contract Reference -->
    <div class="contract-ref">
        <strong>Funeraria:</strong> Funeraria ERP<br>
        <strong>Contrato N°:</strong> {{ $contract->contract_number }}<br>
        <strong>Fecha:</strong> {{ \Carbon\Carbon::parse($contract->created_at)->format('d \d\e F, Y') }}
    </div>

    <!-- Deceased Information -->
    @if($contract->deceased)
    <div class="section">
        <div class="section-title">INFORMACIÓN DEL DIFUNTO</div>
        <div class="info-row">
            <span class="info-label">Nombre completo:</span>
            <span>{{ $contract->deceased->name }}</span>
        </div>
        @if($contract->deceased->death_date)
        <div class="info-row">
            <span class="info-label">Fecha de nacimiento:</span>
            <span>_______________________</span>
        </div>
        <div class="info-row">
            <span class="info-label">Fecha de fallecimiento:</span>
            <span>{{ \Carbon\Carbon::parse($contract->deceased->death_date)->format('d \d\e F, Y') }}</span>
        </div>
        @endif
        @if($contract->deceased->age)
        <div class="info-row">
            <span class="info-label">Edad:</span>
            <span>{{ $contract->deceased->age }} años</span>
        </div>
        @endif
    </div>
    @endif

    <!-- Family Representative -->
    <div class="section">
        <div class="section-title">REPRESENTANTE FAMILIAR</div>
        <div class="info-row">
            <span class="info-label">Nombre:</span>
            <span>{{ $contract->client->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">RUT:</span>
            <span>{{ $contract->client->rut }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Parentesco:</span>
            <span>_______________________</span>
        </div>
        <div class="info-row">
            <span class="info-label">Teléfono:</span>
            <span>{{ $contract->client->phone }}</span>
        </div>
        @if($contract->client->email)
        <div class="info-row">
            <span class="info-label">Email:</span>
            <span>{{ $contract->client->email }}</span>
        </div>
        @endif
    </div>

    <!-- Authorization Checkboxes -->
    <div class="section">
        <div class="section-title">AUTORIZO LA PUBLICACIÓN DE:</div>
        <div class="checkbox-group">
            <div class="checkbox-item">
                <span class="checkbox"></span>
                <span>Texto de obituario con nombre completo y fechas</span>
            </div>
            <div class="checkbox-item">
                <span class="checkbox"></span>
                <span>Fotografía del difunto</span>
            </div>
            <div class="checkbox-item">
                <span class="checkbox"></span>
                <span>Fotografías de la ceremonia</span>
            </div>
            <div class="checkbox-item">
                <span class="checkbox"></span>
                <span>Enlace a libro de condolencias digital</span>
            </div>
        </div>
    </div>

    <!-- Social Networks -->
    <div class="section">
        <div class="section-title">EN LAS SIGUIENTES PLATAFORMAS:</div>
        <div class="checkbox-group">
            <div class="checkbox-item">
                <span class="checkbox"></span>
                <span>Facebook (Página oficial de Funeraria)</span>
            </div>
            <div class="checkbox-item">
                <span class="checkbox"></span>
                <span>Instagram (@funeraria_erp)</span>
            </div>
            <div class="checkbox-item">
                <span class="checkbox"></span>
                <span>Sitio web oficial</span>
            </div>
            <div class="checkbox-item">
                <span class="checkbox"></span>
                <span>WhatsApp Status (cuenta de la funeraria)</span>
            </div>
        </div>
    </div>

    <!-- Content Details -->
    <div class="section">
        <div class="section-title">CONTENIDO A COMPARTIR:</div>
        <p style="margin-bottom: 5px;">✓ Nombre completo del difunto</p>
        <p style="margin-bottom: 5px;">✓ Fechas de nacimiento y fallecimiento</p>
        <p style="margin-bottom: 5px;">✓ Detalles de ceremonia (fecha, hora, lugar)</p>
        <p style="margin-bottom: 5px;">✓ Mensaje familiar (si lo proporcionamos)</p>

        <div style="margin-top: 15px;">
            <strong>PRIVACIDAD:</strong><br>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <span class="checkbox"></span>
                    <span>Público (cualquiera puede ver)</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox"></span>
                    <span>Solo amigos/seguidores</span>
                </div>
            </div>
        </div>

        <div style="margin-top: 15px;">
            <strong>DURACIÓN:</strong><br>
            La publicación permanecerá en línea por:
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <span class="checkbox"></span>
                    <span>30 días</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox"></span>
                    <span>60 días</span>
                </div>
                <div class="checkbox-item">
                    <span class="checkbox"></span>
                    <span>Permanentemente</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Legal Declaration -->
    <div class="legal-text">
        <strong>DECLARACIÓN LEGAL:</strong><br><br>

        Yo, <strong>{{ $contract->client->name }}</strong>, RUT <strong>{{ $contract->client->rut }}</strong>,
        en mi calidad de representante familiar del difunto <strong>{{ $contract->deceased->name ?? '_________________' }}</strong>,
        autorizo voluntariamente a <strong>Funeraria ERP</strong> para publicar la información y material
        fotográfico señalado anteriormente en sus redes sociales oficiales.

        <br><br>
        <strong>Entiendo que:</strong>
        <ul>
            <li>Esta autorización es completamente voluntaria</li>
            <li>Puedo solicitar la eliminación en cualquier momento contactando a la funeraria</li>
            <li>La información será manejada con respeto y profesionalismo</li>
            <li>La funeraria no es responsable por comentarios de terceros en las publicaciones</li>
            <li>Los datos personales serán tratados conforme a la Ley 19.628 sobre Protección de Datos Personales</li>
        </ul>
    </div>

    <!-- Signature Section -->
    <div class="signature-section">
        <div class="signature-box">
            <strong>FIRMAS:</strong>
            <div class="signature-line">
                <div style="width: 45%; text-align: center;">
                    <div style="margin-bottom: 5px;">_______________________________</div>
                    <strong>Firma Representante Familiar</strong><br>
                    {{ $contract->client->name }}<br>
                    RUT: {{ $contract->client->rut }}
                </div>
                <div style="width: 45%; text-align: center;">
                    <div style="margin-bottom: 5px;">_______________________________</div>
                    <strong>Fecha</strong><br>
                    {{ \Carbon\Carbon::parse($contract->created_at)->format('d/m/Y') }}
                </div>
            </div>
        </div>

        <div class="signature-box" style="margin-top: 50px;">
            <div class="signature-line">
                <div style="width: 45%; text-align: center;">
                    <div style="margin-bottom: 5px;">_______________________________</div>
                    <strong>Firma Testigo - Secretaria</strong><br>
                    {{ $contract->user->name ?? 'Secretaria' }}<br>
                    Funeraria ERP
                </div>
                <div style="width: 45%; text-align: center;">
                    <div style="margin-bottom: 5px;">_______________________________</div>
                    <strong>Fecha</strong><br>
                    {{ \Carbon\Carbon::parse($contract->created_at)->format('d/m/Y') }}
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><strong>Este documento forma parte del expediente del Contrato {{ $contract->contract_number }}</strong></p>
        <p style="margin-top: 5px;">Para más información sobre privacidad: www.funeraria-erp.cl/privacidad</p>
        <p style="margin-top: 10px;">Funeraria ERP | Teléfono: +56 X XXXX XXXX | Email: contacto@funeraria.cl</p>
        <p style="margin-top: 5px;">Documento generado el {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}</p>
    </div>
</body>
</html>
