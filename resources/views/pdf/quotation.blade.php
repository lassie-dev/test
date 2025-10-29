<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización - {{ $contract->contract_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            padding: 30px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1e40af;
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header h2 {
            font-size: 18px;
            color: #64748b;
            font-weight: normal;
        }
        .info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .info-box h3 {
            color: #1e40af;
            font-size: 14px;
            margin-bottom: 10px;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 5px;
        }
        .info-row {
            display: flex;
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            width: 150px;
            color: #475569;
        }
        .info-value {
            flex: 1;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table thead {
            background: #1e40af;
            color: white;
        }
        table th {
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        table tbody tr:nth-child(even) {
            background: #f8fafc;
        }
        .totals-section {
            margin-top: 30px;
            float: right;
            width: 400px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        .total-row.subtotal {
            font-size: 14px;
            font-weight: bold;
        }
        .total-row.discount {
            color: #dc2626;
        }
        .total-row.final {
            background: #1e40af;
            color: white;
            font-size: 18px;
            font-weight: bold;
            border: none;
            margin-top: 10px;
        }
        .payment-options {
            clear: both;
            margin-top: 40px;
            background: #f1f5f9;
            padding: 20px;
            border-radius: 5px;
        }
        .payment-options h3 {
            color: #1e40af;
            margin-bottom: 15px;
        }
        .payment-option {
            margin-bottom: 15px;
            padding: 10px;
            background: white;
            border-left: 4px solid #1e40af;
        }
        .terms {
            margin-top: 30px;
            padding: 20px;
            background: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 5px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 11px;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
            text-align: center;
        }
        .signature-line {
            border-top: 2px solid #000;
            margin-top: 50px;
            padding-top: 10px;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>COTIZACIÓN SERVICIOS FUNERARIOS</h1>
        <h2>Estimación de Costos</h2>
    </div>

    <!-- Contract Information -->
    <div class="info-box">
        <div class="info-row">
            <span class="info-label">Cotización N°:</span>
            <span class="info-value"><strong>{{ $contract->contract_number }}</strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">Fecha:</span>
            <span class="info-value">{{ \Carbon\Carbon::parse($contract->created_at)->format('d \d\e F, Y') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Válida hasta:</span>
            <span class="info-value">{{ \Carbon\Carbon::parse($contract->created_at)->addDays(30)->format('d \d\e F, Y') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Tipo:</span>
            <span class="info-value">{{ $contract->type === 'immediate_need' ? 'Necesidad Inmediata' : 'Necesidad Futura' }}</span>
        </div>
    </div>

    <!-- Client Information -->
    <div class="info-box">
        <h3>INFORMACIÓN DEL CLIENTE</h3>
        <div class="info-row">
            <span class="info-label">Nombre:</span>
            <span class="info-value">{{ $contract->client->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">RUT:</span>
            <span class="info-value">{{ $contract->client->rut }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Teléfono:</span>
            <span class="info-value">{{ $contract->client->phone }}</span>
        </div>
        @if($contract->client->email)
        <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ $contract->client->email }}</span>
        </div>
        @endif
    </div>

    <!-- Deceased Information (if immediate need) -->
    @if($contract->deceased)
    <div class="info-box">
        <h3>INFORMACIÓN DEL DIFUNTO</h3>
        <div class="info-row">
            <span class="info-label">Nombre:</span>
            <span class="info-value">{{ $contract->deceased->name }}</span>
        </div>
        @if($contract->deceased->age)
        <div class="info-row">
            <span class="info-label">Edad:</span>
            <span class="info-value">{{ $contract->deceased->age }} años</span>
        </div>
        @endif
        @if($contract->deceased->death_date)
        <div class="info-row">
            <span class="info-label">Fecha de fallecimiento:</span>
            <span class="info-value">{{ \Carbon\Carbon::parse($contract->deceased->death_date)->format('d/m/Y') }}</span>
        </div>
        @endif
    </div>
    @endif

    <!-- Services -->
    <h3 style="color: #1e40af; margin-top: 30px; margin-bottom: 15px; font-size: 16px;">SERVICIOS INCLUIDOS</h3>
    <table>
        <thead>
            <tr>
                <th>Servicio</th>
                <th>Cantidad</th>
                <th style="text-align: right;">Precio Unit.</th>
                <th style="text-align: right;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($contract->services as $service)
            <tr>
                <td>
                    <strong>{{ $service->name }}</strong>
                    @if($service->description)
                    <br><small style="color: #64748b;">{{ $service->description }}</small>
                    @endif
                </td>
                <td>{{ $service->pivot->quantity }}</td>
                <td style="text-align: right;">${{ number_format($service->pivot->unit_price, 0, ',', '.') }}</td>
                <td style="text-align: right;"><strong>${{ number_format($service->pivot->subtotal, 0, ',', '.') }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Products -->
    @if($contract->products && $contract->products->count() > 0)
    <h3 style="color: #1e40af; margin-top: 30px; margin-bottom: 15px; font-size: 16px;">PRODUCTOS INCLUIDOS</h3>
    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th style="text-align: right;">Precio Unit.</th>
                <th style="text-align: right;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($contract->products as $product)
            <tr>
                <td>
                    <strong>{{ $product->name }}</strong>
                    @if($product->description)
                    <br><small style="color: #64748b;">{{ $product->description }}</small>
                    @endif
                </td>
                <td>{{ $product->pivot->quantity }}</td>
                <td style="text-align: right;">${{ number_format($product->pivot->unit_price, 0, ',', '.') }}</td>
                <td style="text-align: right;"><strong>${{ number_format($product->pivot->subtotal, 0, ',', '.') }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <!-- Totals -->
    <div class="totals-section">
        <div class="total-row subtotal">
            <span>SUBTOTAL:</span>
            <span>${{ number_format($contract->subtotal, 0, ',', '.') }}</span>
        </div>
        @if($contract->discount_percentage > 0)
        <div class="total-row discount">
            <span>Descuento ({{ $contract->discount_percentage }}%):</span>
            <span>-${{ number_format($contract->discount_amount, 0, ',', '.') }}</span>
        </div>
        @endif
        <div class="total-row final">
            <span>TOTAL ESTIMADO:</span>
            <span>${{ number_format($contract->total, 0, ',', '.') }}</span>
        </div>
    </div>

    <!-- Payment Options -->
    <div class="payment-options">
        <h3>OPCIONES DE PAGO</h3>

        <div class="payment-option">
            <strong>Contado (Efectivo/Tarjeta):</strong><br>
            Pago completo: ${{ number_format($contract->total, 0, ',', '.') }}
        </div>

        <div class="payment-option">
            <strong>Crédito sin interés:</strong><br>
            @php
                $installmentOptions = [3, 6, 9, 12];
            @endphp
            @foreach($installmentOptions as $months)
            • {{ $months }} cuotas: ${{ number_format($contract->total / $months, 0, ',', '.') }} mensuales<br>
            @endforeach
            <br>
            <small>Pie sugerido: 30% (${{ number_format($contract->total * 0.30, 0, ',', '.') }})</small>
        </div>
    </div>

    <!-- Terms -->
    <div class="terms">
        <strong>IMPORTANTE:</strong><br>
        • Esta cotización es referencial y válida por 30 días desde su emisión.<br>
        • Para confirmar el servicio, debe firmarse el contrato respectivo.<br>
        • Los precios pueden estar sujetos a variación según disponibilidad.<br>
        • El servicio se prestará una vez confirmado el contrato y recibido el pago inicial.
    </div>

    <!-- Signature Section -->
    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line">
                <strong>Firma Secretaria</strong><br>
                {{ $contract->user->name ?? 'Secretaria' }}
            </div>
        </div>
        <div class="signature-box">
            <div class="signature-line">
                <strong>Firma Cliente</strong><br>
                {{ $contract->client->name }}
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><strong>Funeraria ERP</strong></p>
        <p>Servicios Funerarios de Excelencia</p>
        <p>Teléfono: +56 X XXXX XXXX | Email: contacto@funeraria.cl</p>
        <p style="margin-top: 10px; font-size: 10px;">Documento generado el {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}</p>
    </div>
</body>
</html>
