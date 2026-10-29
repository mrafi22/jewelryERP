<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        if ($user) {
            $user->loadMissing('branch');
        }

        $activeBranch = null;
        if ($user && $user->branch) {
            $activeBranch = $user->branch;
        } elseif ($request->session()->has('active_branch_id')) {
            $activeBranch = \App\Models\Branch::find($request->session()->get('active_branch_id'));
        }

        $isMainBranch = $user ? $user->isMainBranch() : true;

        $latestMetalPrices = \App\Models\MetalPrice::with('purity')
            ->orderBy('effective_date', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->unique(function ($item) {
                return $item->metal_type . '_' . $item->purity_id;
            })
            ->values();

        $softwareName = \App\Models\SystemSetting::getByKey('company_name');
        if (!$softwareName || in_array(strtolower(trim($softwareName)), ['jewelry erp limited', 'jewelry erp', 'jewelry', 'jewelry erp store'])) {
            $branch = $activeBranch ?? \App\Models\Branch::where('is_head_office', true)->first();
            if ($branch && !in_array(strtolower(trim($branch->name)), ['main branch', 'main', 'jewelry erp'])) {
                $softwareName = $branch->name;
            } else {
                $appName = config('app.name');
                if ($appName && !in_array(strtolower(trim($appName)), ['jewelry', 'jewelry erp', 'laravel'])) {
                    $softwareName = $appName;
                } else {
                    $softwareName = 'স্বর্ণালংকার জুয়েলার্স';
                }
            }
        }

        return [
            ...parent::share($request),
            'software_name' => $softwareName,
            'company_name' => $softwareName,
            'auth' => [
                'user' => $user,
                'active_branch' => $activeBranch,
                'is_main_branch' => $isMainBranch,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],
            'metal_prices' => $latestMetalPrices,
        ];
    }
}
