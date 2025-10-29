<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    protected $apiUrl;
    protected $apiToken;
    protected $fromNumber;

    public function __construct()
    {
        $this->apiUrl = env('WHATSAPP_API_URL', 'https://api.whatsapp.com/send');
        $this->apiToken = env('WHATSAPP_API_TOKEN');
        $this->fromNumber = env('WHATSAPP_FROM_NUMBER');
    }

    /**
     * Send immediate notification to assigned staff when contract is created
     */
    public function notifyAssignedStaff(Contract $contract)
    {
        $messages = [];

        // Notify driver
        if ($contract->assignedDriver && $contract->assignedDriver->phone) {
            $message = $this->getStaffAssignmentMessage($contract, 'driver');
            $messages[] = $this->sendMessage($contract->assignedDriver->phone, $message, 'staff_assignment_driver', $contract->id);
        }

        // Notify assistant
        if ($contract->assignedAssistant && $contract->assignedAssistant->phone) {
            $message = $this->getStaffAssignmentMessage($contract, 'assistant');
            $messages[] = $this->sendMessage($contract->assignedAssistant->phone, $message, 'staff_assignment_assistant', $contract->id);
        }

        return $messages;
    }

    /**
     * Send 4-hour post-service tips to family
     */
    public function sendPostServiceTips(Contract $contract)
    {
        if (!$contract->client->phone) {
            return null;
        }

        $message = $this->getPostServiceTipsMessage($contract);
        return $this->sendMessage($contract->client->phone, $message, 'post_service_tips', $contract->id);
    }

    /**
     * Send 5-day memorial card reminder
     */
    public function sendMemorialCardReminder(Contract $contract)
    {
        if (!$contract->client->phone) {
            return null;
        }

        $message = $this->getMemorialCardMessage($contract);
        return $this->sendMessage($contract->client->phone, $message, 'memorial_card', $contract->id);
    }

    /**
     * Send 8-day satisfaction survey
     */
    public function sendSatisfactionSurvey(Contract $contract)
    {
        if (!$contract->client->phone) {
            return null;
        }

        $message = $this->getSatisfactionSurveyMessage($contract);
        return $this->sendMessage($contract->client->phone, $message, 'satisfaction_survey', $contract->id);
    }

    /**
     * Send 1-month commemoration invitation
     */
    public function sendCommemorationInvitation(Contract $contract)
    {
        if (!$contract->client->phone) {
            return null;
        }

        $message = $this->getCommemorationMessage($contract);
        return $this->sendMessage($contract->client->phone, $message, 'commemoration_invitation', $contract->id);
    }

    /**
     * Send birthday reminder
     */
    public function sendBirthdayReminder(Contract $contract)
    {
        if (!$contract->client->phone || !$contract->deceased) {
            return null;
        }

        $message = $this->getBirthdayReminderMessage($contract);
        return $this->sendMessage($contract->client->phone, $message, 'birthday_reminder', $contract->id);
    }

    /**
     * Send 1-year anniversary message
     */
    public function sendAnniversaryMessage(Contract $contract)
    {
        if (!$contract->client->phone || !$contract->deceased) {
            return null;
        }

        $message = $this->getAnniversaryMessage($contract);
        return $this->sendMessage($contract->client->phone, $message, 'anniversary', $contract->id);
    }

    /**
     * Send payment reminder (7 days before due date)
     */
    public function sendPaymentReminder($payment)
    {
        if (!$payment->contract->client->phone) {
            return null;
        }

        $message = $this->getPaymentReminderMessage($payment);
        return $this->sendMessage($payment->contract->client->phone, $message, 'payment_reminder', $payment->id);
    }

    /**
     * Send overdue payment notice (3 days after due date)
     */
    public function sendOverdueNotice($payment)
    {
        if (!$payment->contract->client->phone) {
            return null;
        }

        $message = $this->getOverdueNoticeMessage($payment);
        return $this->sendMessage($payment->contract->client->phone, $message, 'overdue_notice', $payment->id);
    }

    /**
     * Send actual WhatsApp message via API
     */
    protected function sendMessage($phoneNumber, $message, $type, $relatedId = null)
    {
        // Format phone number (ensure it has country code)
        $formattedPhone = $this->formatPhoneNumber($phoneNumber);

        try {
            // Log the notification attempt
            $notification = Notification::create([
                'type' => $type,
                'recipient' => $formattedPhone,
                'message' => $message,
                'related_id' => $relatedId,
                'status' => 'pending',
                'scheduled_at' => now(),
            ]);

            // In production, replace this with actual WhatsApp API call
            // Example using Twilio or similar:
            // $response = Http::withHeaders([
            //     'Authorization' => 'Bearer ' . $this->apiToken,
            // ])->post($this->apiUrl, [
            //     'from' => $this->fromNumber,
            //     'to' => $formattedPhone,
            //     'body' => $message,
            // ]);

            // For now, just log it
            Log::info("WhatsApp message queued", [
                'type' => $type,
                'phone' => $formattedPhone,
                'message' => $message,
            ]);

            // Update notification as sent
            $notification->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            return $notification;
        } catch (\Exception $e) {
            Log::error("WhatsApp send failed: " . $e->getMessage());

            if (isset($notification)) {
                $notification->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                ]);
            }

            return null;
        }
    }

    /**
     * Format phone number to include country code
     */
    protected function formatPhoneNumber($phone)
    {
        // Remove any non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // If doesn't start with country code, add Chile's +56
        if (!str_starts_with($phone, '56')) {
            $phone = '56' . $phone;
        }

        return '+' . $phone;
    }

    /**
     * Message Templates
     */
    protected function getStaffAssignmentMessage(Contract $contract, $role)
    {
        $roleName = $role === 'driver' ? 'conductor' : 'auxiliar';
        $deceasedName = $contract->deceased ? $contract->deceased->name : 'el difunto';

        return "🚨 *Nueva Asignación de Servicio*\n\n" .
               "Hola, has sido asignado como {$roleName} para el siguiente servicio:\n\n" .
               "📋 *Contrato:* {$contract->contract_number}\n" .
               "👤 *Difunto:* {$deceasedName}\n" .
               "📞 *Familia:* {$contract->client->name} - {$contract->client->phone}\n" .
               ($contract->service_location ? "📍 *Ubicación:* {$contract->service_location}\n" : "") .
               ($contract->service_datetime ? "🕐 *Fecha/Hora:* " . \Carbon\Carbon::parse($contract->service_datetime)->format('d/m/Y H:i') . "\n" : "") .
               "\nPor favor confirma recepción de este mensaje.\n\n" .
               "_Funeraria ERP - Gestión de Servicios_";
    }

    protected function getPostServiceTipsMessage(Contract $contract)
    {
        $clientName = explode(' ', $contract->client->name)[0]; // First name only

        return "Hola {$clientName},\n\n" .
               "Esperamos que usted y su familia estén encontrando consuelo en estos momentos difíciles.\n\n" .
               "*Algunos consejos para los próximos días:*\n\n" .
               "🕊️ Tómense tiempo para el duelo\n" .
               "💚 Apoyen se mutuamente como familia\n" .
               "📞 No duden en comunicarse si necesitan algo\n" .
               "🙏 Recuerden que el dolor es un proceso natural\n\n" .
               "Estamos aquí para ustedes.\n\n" .
               "_Funeraria ERP_";
    }

    protected function getMemorialCardMessage(Contract $contract)
    {
        $clientName = explode(' ', $contract->client->name)[0];
        $deceasedName = $contract->deceased ? $contract->deceased->name : '';

        return "Estimado/a {$clientName},\n\n" .
               "Ya han pasado 5 días desde el fallecimiento de {$deceasedName}.\n\n" .
               "Queremos recordarle que tenemos disponibles *tarjetas de recordatorio* con la foto y datos del difunto.\n\n" .
               "Estas tarjetas son un hermoso detalle para compartir con familiares y amigos.\n\n" .
               "Si desea ordenar tarjetas, por favor contáctenos al:\n" .
               "📞 [Número de contacto]\n\n" .
               "Con cariño,\n" .
               "_Funeraria ERP_";
    }

    protected function getSatisfactionSurveyMessage(Contract $contract)
    {
        $clientName = explode(' ', $contract->client->name)[0];

        return "Hola {$clientName},\n\n" .
               "Han pasado 8 días desde que les acompañamos en estos momentos difíciles.\n\n" .
               "Nos gustaría saber su opinión sobre nuestro servicio:\n\n" .
               "¿Cómo calificaría nuestra atención? ⭐⭐⭐⭐⭐\n" .
               "¿Algo que podamos mejorar?\n\n" .
               "Su feedback nos ayuda a servir mejor a otras familias.\n\n" .
               "Puede responder directamente a este mensaje.\n\n" .
               "Gracias por su confianza,\n" .
               "_Funeraria ERP_";
    }

    protected function getCommemorationMessage(Contract $contract)
    {
        $clientName = explode(' ', $contract->client->name)[0];
        $deceasedName = $contract->deceased ? $contract->deceased->name : '';

        return "Estimado/a {$clientName},\n\n" .
               "Ha pasado un mes desde el fallecimiento de {$deceasedName}.\n\n" .
               "Los recordamos con cariño y queremos invitarlos a una *misa de conmemoración* que realizaremos próximamente.\n\n" .
               "Esta es una oportunidad para reunirse con familiares y amigos, y honrar la memoria de su ser querido.\n\n" .
               "📅 Fecha: [Por definir]\n" .
               "⛪ Lugar: [Por definir]\n\n" .
               "Les confirmaremos los detalles pronto.\n\n" .
               "Con respeto y cariño,\n" .
               "_Funeraria ERP_";
    }

    protected function getBirthdayReminderMessage(Contract $contract)
    {
        $clientName = explode(' ', $contract->client->name)[0];
        $deceasedName = $contract->deceased ? $contract->deceased->name : '';

        return "Hola {$clientName},\n\n" .
               "Hoy es el cumpleaños de {$deceasedName}.\n\n" .
               "Queremos que sepan que los recordamos y que estamos con ustedes en pensamiento.\n\n" .
               "Los recuerdos hermosos nunca mueren. 🕊️💙\n\n" .
               "Con cariño,\n" .
               "_Funeraria ERP_";
    }

    protected function getAnniversaryMessage(Contract $contract)
    {
        $clientName = explode(' ', $contract->client->name)[0];
        $deceasedName = $contract->deceased ? $contract->deceased->name : '';

        return "Estimado/a {$clientName},\n\n" .
               "Ha pasado un año desde el fallecimiento de {$deceasedName}.\n\n" .
               "Queremos que sepan que los recordamos con cariño en este día especial.\n\n" .
               "Si desean realizar alguna ceremonia conmemorativa, estaremos encantados de ayudarles.\n\n" .
               "Nuestros pensamientos están con ustedes. 🙏💐\n\n" .
               "Con respeto,\n" .
               "_Funeraria ERP_";
    }

    protected function getPaymentReminderMessage($payment)
    {
        $clientName = explode(' ', $payment->contract->client->name)[0];
        $dueDate = \Carbon\Carbon::parse($payment->due_date)->format('d/m/Y');
        $amount = number_format($payment->amount, 0, ',', '.');

        return "Hola {$clientName},\n\n" .
               "Este es un recordatorio amistoso sobre su próximo pago:\n\n" .
               "💰 *Monto:* ${amount}\n" .
               "📅 *Fecha de vencimiento:* {$dueDate}\n" .
               "📋 *Contrato:* {$payment->contract->contract_number}\n\n" .
               "Puede realizar su pago en:\n" .
               "• Nuestras oficinas\n" .
               "• Transferencia bancaria\n" .
               "• [Otros métodos]\n\n" .
               "Si ya realizó el pago, por favor ignore este mensaje.\n\n" .
               "Gracias por su confianza,\n" .
               "_Funeraria ERP_";
    }

    protected function getOverdueNoticeMessage($payment)
    {
        $clientName = explode(' ', $payment->contract->client->name)[0];
        $dueDate = \Carbon\Carbon::parse($payment->due_date)->format('d/m/Y');
        $amount = number_format($payment->amount, 0, ',', '.');

        return "Hola {$clientName},\n\n" .
               "Notamos que su pago está pendiente:\n\n" .
               "💰 *Monto:* ${amount}\n" .
               "📅 *Venció el:* {$dueDate}\n" .
               "📋 *Contrato:* {$payment->contract->contract_number}\n\n" .
               "Por favor, póngase al día lo antes posible para evitar recargos.\n\n" .
               "Si tiene algún inconveniente, contáctenos para buscar una solución:\n" .
               "📞 [Número de contacto]\n\n" .
               "Gracias por su comprensión,\n" .
               "_Funeraria ERP_";
    }
}
