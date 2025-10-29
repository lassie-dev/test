<?php

namespace App\Console\Commands;

use App\Models\Agreement;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckAgreementExpirations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'agreements:check-expirations
                            {--days=30 : Number of days before expiration to alert}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for corporate agreements expiring soon and send alerts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = (int) $this->option('days');

        $this->info("Checking for agreements expiring within {$days} days...");
        $this->newLine();

        $expiringDate = Carbon::now()->addDays($days);

        // Find agreements expiring soon
        $expiringAgreements = Agreement::where('status', 'active')
            ->where('end_date', '<=', $expiringDate)
            ->where('end_date', '>=', Carbon::now())
            ->orderBy('end_date')
            ->get();

        if ($expiringAgreements->isEmpty()) {
            $this->info('✓ No agreements expiring in the next ' . $days . ' days');
            return 0;
        }

        $this->warn('Found ' . $expiringAgreements->count() . ' agreement(s) expiring soon:');
        $this->newLine();

        // Display expiring agreements
        $tableData = $expiringAgreements->map(function ($agreement) {
            $daysUntilExpiration = Carbon::now()->diffInDays($agreement->end_date, false);
            return [
                $agreement->code,
                $agreement->company_name,
                $agreement->end_date->format('Y-m-d'),
                $daysUntilExpiration . ' days',
                $agreement->contact_name,
                $agreement->contact_phone,
            ];
        })->toArray();

        $this->table(
            ['Code', 'Company', 'End Date', 'Days Left', 'Contact', 'Phone'],
            $tableData
        );

        // Auto-update status for expired agreements
        $expiredCount = 0;
        foreach ($expiringAgreements as $agreement) {
            if ($agreement->end_date->isPast()) {
                $agreement->update(['status' => 'expired']);
                $expiredCount++;
            }
        }

        if ($expiredCount > 0) {
            $this->newLine();
            $this->warn("Marked {$expiredCount} agreement(s) as expired");
        }

        $this->newLine();
        $this->info('✓ Agreement expiration check completed');

        return 0;
    }
}
