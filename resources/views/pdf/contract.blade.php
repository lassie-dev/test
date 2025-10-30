<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrato - {{ $contract->contract_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #000;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .header-table {
            border: 1px solid #000;
            margin-bottom: 10px;
        }
        .header-table td {
            border: 1px solid #000;
            padding: 8px;
        }
        .company-name {
            text-align: center;
            font-weight: bold;
            font-size: 12px;
        }
        .contract-number {
            text-align: left;
            font-weight: bold;
            font-size: 22px;
        }
        .header-info {
            font-weight: bold;
        }
        .email-row {
            text-align: center;
            background-color: #f0f0f0;
            font-weight: bold;
            color: #4F6228;
        }
        .section-title {
            font-weight: bold;
            font-size: 12px;
            margin-top: 15px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        .info-table {
            border: 1px solid #000;
            margin-bottom: 10px;
        }
        .info-table td {
            border: 1px solid #000;
            padding: 6px;
        }
        .label {
            font-weight: bold;
            width: 25%;
        }
        .value {
            width: 25%;
        }
        .signature-section {
            margin-top: 40px;
            text-align: center;
        }
        .coordinator {
            margin-top: 20px;
            font-weight: bold;
        }
        .piedad {
            margin-top: 10px;
            text-align: center;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <table class="header-table">
        <tr>
            <td rowspan="2" class="company-name" style="width: 45%; vertical-align: top; padding-top: 15px;">
                <img src="{{ public_path('images/logo.png') }}" alt="Logo" style="max-width: 180px; height: auto; margin-bottom: 10px;"><br>
                Nuevo Amanecer<br>
                <span style="font-size: 11px;">14 de febrero 2010</span><br>
                <span style="font-size: 11px;">Fono: 55 243 02 29</span><br>
                <span style="font-size: 11px;">Rut: 6.897.257-4</span>
            </td>
            <td style="width: 5%;"></td>
            <td style="width: 50%;" class="contract-number">
                {{ str_replace('CTR-', '', $contract->contract_number) }}
            </td>
        </tr>
        <tr>
            <td></td>
            <td>
                <strong>Fecha:</strong> {{ \Carbon\Carbon::parse($contract->created_at)->format('d-m-Y') }}<br>
                <strong>Hora:</strong> {{ \Carbon\Carbon::parse($contract->created_at)->format('H:i') }}<br>
                <strong>Fact No.</strong>
            </td>
        </tr>
        <tr>
            <td colspan="3" class="email-row">
                Email: secretaria@funerarianuevoamanecer.cl
            </td>
        </tr>
    </table>

    <!-- SOLICITANTE -->
    <div class="section-title">SOLICITANTE</div>
    <table class="info-table">
        <tr>
            <td class="label">Nombre:</td>
            <td colspan="3" class="value">{{ $contract->client->name ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">Teléfono:</td>
            <td class="value">{{ $contract->client->phone ?? '' }}</td>
            <td class="label">RUT No.</td>
            <td class="value">{{ $contract->client->rut ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">DIRECCION:</td>
            <td colspan="3" class="value">{{ $contract->client->address ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">ACTIVIDAD</td>
            <td class="value">{{ $contract->client->occupation ?? '' }}</td>
            <td class="label">Parentesco:</td>
            <td class="value">{{ $contract->client->relationship_to_deceased ?? '' }}</td>
        </tr>
    </table>

    <!-- EMPRESA (if agreement exists) -->
    @if($contract->agreement)
    <table class="info-table">
        <tr>
            <td class="label">Nombre de la Empresa:</td>
            <td colspan="3" class="value">{{ $contract->agreement->company_name ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">Rut:</td>
            <td colspan="3" class="value">{{ $contract->agreement->code ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">Dirección:</td>
            <td colspan="3" class="value"></td>
        </tr>
        <tr>
            <td class="label">Giro o Actividad:</td>
            <td colspan="3" class="value"></td>
        </tr>
        <tr>
            <td class="label">Correo:</td>
            <td colspan="3" class="value"></td>
        </tr>
    </table>
    @endif

    <!-- OBSERVACIONES -->
    <div class="section-title">OBSERVACIONES:</div>
    <div style="border: 1px solid #000; padding: 6px; min-height: 40px; margin-bottom: 10px;">
        {{ $contract->special_requests ?? '' }}
        @if($contract->additional_staff_notes)
        <br>{{ $contract->additional_staff_notes }}
        @endif
    </div>

    <!-- DETALLE DEL SERVICIO -->
    <div class="section-title">DETALLE DEL SERVICIO</div>
    <table class="info-table">
        @if($contract->deceased)
        <tr>
            <td class="label" style="width: 20%;">Fallecido:</td>
            <td class="value" style="width: 30%;">{{ $contract->deceased->name ?? '' }}</td>
            <td class="label" style="width: 20%;">RUT:</td>
            <td class="value" style="width: 30%;"></td>
        </tr>
        <tr>
            <td class="label">Dirección:</td>
            <td class="value" colspan="3">{{ $contract->deceased->death_place ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">Nivel Estudio:</td>
            <td class="value">{{ $contract->deceased->education_level ?? '' }}</td>
            <td class="label">Profesión:</td>
            <td class="value">{{ $contract->deceased->profession ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">Estado Civil:</td>
            <td class="value" colspan="3">{{ $contract->deceased->marital_status ?? '' }}</td>
        </tr>
        @else
        <tr>
            <td class="label" style="width: 20%;">Fallecido:</td>
            <td class="value" style="width: 30%;"></td>
            <td class="label" style="width: 20%;">RUT:</td>
            <td class="value" style="width: 30%;"></td>
        </tr>
        <tr>
            <td class="label">Dirección:</td>
            <td class="value" colspan="3"></td>
        </tr>
        <tr>
            <td class="label">Nivel Estudio:</td>
            <td class="value"></td>
            <td class="label">Profesión:</td>
            <td class="value"></td>
        </tr>
        <tr>
            <td class="label">Estado Civil:</td>
            <td class="value" colspan="3"></td>
        </tr>
        @endif
        <tr>
            <td class="label">Recepción:</td>
            <td class="value">{{ $contract->reception_location ?? '' }}</td>
            <td class="label">Cementerio:</td>
            <td class="value">{{ $contract->cemetery->name ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">Velatorio En:</td>
            <td class="value">{{ $contract->wakeRoom->name ?? '' }}</td>
            <td class="label">Dirección:</td>
            <td class="value">{{ $contract->service_location ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">Modelo De La Urna:</td>
            <td class="value" colspan="3">{{ $contract->coffin_model ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">Fecha Funeral:</td>
            <td class="value">{{ $contract->service_datetime ? \Carbon\Carbon::parse($contract->service_datetime)->format('d-m-Y') : '' }}</td>
            <td class="label">Instalo:</td>
            <td class="value"></td>
        </tr>
        <tr>
            <td class="label">Hora Funeral Llegada:</td>
            <td class="value">{{ $contract->service_datetime ? \Carbon\Carbon::parse($contract->service_datetime)->format('H:i') : '' }}</td>
            <td class="label">Sector:</td>
            <td class="value">{{ $contract->cemetery_sector ?? '' }}</td>
        </tr>
        <tr>
            <td class="label">Hora De Salida:</td>
            <td class="value" colspan="3"></td>
        </tr>
        <tr>
            <td class="label">Cortejo:</td>
            <td class="value">{{ $contract->procession_details ?? '' }}</td>
            <td class="label">Refuerzo:</td>
            <td class="value"></td>
        </tr>
        <tr>
            <td class="label">Auto:</td>
            <td class="value">{{ $contract->assignedVehicle->name ?? '' }}</td>
            <td class="label">Religión:</td>
            <td class="value">{{ $contract->deceased->religion ?? '' }}</td>
        </tr>
    </table>

    <!-- Signature Section -->
    <div class="signature-section">
        <strong>FIRMA DEL CLIENTE:</strong> _____________________________
    </div>

    <div class="coordinator">
        Coordinador: {{ $contract->user->name ?? '' }}
    </div>

    <div class="piedad">
        PIEDAD
    </div>
</body>
</html>
