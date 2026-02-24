import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

declare const Chart: any;

@Component({
    selector: 'app-admin-statistics',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <!-- Page Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
      <div class="px-8 py-4 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Statistiques & Rapports</h2>
          <p class="text-xs text-gray-400 mt-0.5">Données en temps réel depuis la base de données</p>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Period selector -->
          <select [(ngModel)]="selectedPeriod" (change)="loadStats()" class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 derniers mois</option>
            <option value="365">12 derniers mois</option>
          </select>
          <!-- Export buttons -->
          <button (click)="exportExcel()" [disabled]="isLoading"
            class="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50">
            <i class="fas fa-file-excel"></i>
            <span>Excel</span>
          </button>
          <button (click)="exportPDF()" [disabled]="isLoading"
            class="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50">
            <i class="fas fa-file-pdf"></i>
            <span>PDF</span>
          </button>
        </div>
      </div>
    </header>

    <div class="p-8 bg-gray-50 min-h-screen">
      <!-- Loading overlay -->
      <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-24">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-500 text-sm">Chargement des statistiques...</p>
      </div>

      <div *ngIf="!isLoading && stats">
        <!-- ── KPI Cards ───────────────────────────────────────────── -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <!-- Revenus -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i class="fas fa-chart-line text-blue-600 text-lg"></i>
              </div>
              <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <i class="fas fa-arrow-up text-xs mr-1"></i>Total
              </span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ formatAmount(stats.kpi.totalRevenue) }}</p>
            <p class="text-sm text-gray-500 mt-1">Revenus totaux (Ar)</p>
          </div>

          <!-- Commandes -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i class="fas fa-shopping-bag text-green-600 text-lg"></i>
              </div>
              <span class="text-xs text-gray-400">Commandes</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.kpi.totalOrders | number }}</p>
            <p class="text-sm text-gray-500 mt-1">Ventes totales</p>
          </div>

          <!-- Panier moyen -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i class="fas fa-receipt text-purple-600 text-lg"></i>
              </div>
              <span class="text-xs text-gray-400">Moyenne</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ formatAmount(stats.kpi.avgOrderValue) }}</p>
            <p class="text-sm text-gray-500 mt-1">Panier moyen (Ar)</p>
          </div>

          <!-- Clients actifs -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <i class="fas fa-users text-orange-500 text-lg"></i>
              </div>
              <span class="text-xs text-gray-400">Acheteurs</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.kpi.uniqueBuyers | number }}</p>
            <p class="text-sm text-gray-500 mt-1">Clients uniques</p>
          </div>
        </div>

        <!-- ── Charts Row 1 ───────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Revenus journaliers – Line chart (big) -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold text-gray-800">Évolution des revenus</h3>
              <span class="text-xs text-gray-400">{{ selectedPeriod }} derniers jours</span>
            </div>
            <div style="height:260px; position:relative;">
              <canvas id="lineChart"></canvas>
            </div>
          </div>

          <!-- Répartition par statut – Doughnut -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="font-semibold text-gray-800 mb-4">Statuts des commandes</h3>
            <div style="height:220px; position:relative;">
              <canvas id="doughnutChart"></canvas>
            </div>
            <div class="mt-4 space-y-1">
              <div *ngFor="let s of stats.charts.statusDistribution" class="flex justify-between text-xs text-gray-600">
                <span>{{ getStatusLabel(s._id) }}</span>
                <span class="font-semibold">{{ s.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Charts Row 2 ───────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Top boutiques – Bar chart -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="font-semibold text-gray-800 mb-4">
              <i class="fas fa-store text-blue-500 mr-2"></i>Top boutiques par revenus
            </h3>
            <div style="height:240px; position:relative;">
              <canvas id="storeBarChart"></canvas>
            </div>
          </div>

          <!-- Nombre de commandes par jour – Bar chart -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="font-semibold text-gray-800 mb-4">
              <i class="fas fa-calendar-alt text-green-500 mr-2"></i>Commandes par jour
            </h3>
            <div style="height:240px; position:relative;">
              <canvas id="ordersBarChart"></canvas>
            </div>
          </div>
        </div>

        <!-- ── Tables Row ─────────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Top produits -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
              <h3 class="font-semibold text-gray-800">
                <i class="fas fa-fire text-orange-500 mr-2"></i>Produits les plus vendus
              </h3>
              <span class="text-xs text-gray-400">Top 10</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-50 text-gray-500 text-xs uppercase">
                    <th class="px-6 py-3 text-left">#</th>
                    <th class="px-6 py-3 text-left">Produit</th>
                    <th class="px-6 py-3 text-right">Qté vendue</th>
                    <th class="px-6 py-3 text-right">Revenus (Ar)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of stats.charts.topProducts; let i = index"
                      class="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-3">
                      <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        [class.bg-yellow-100]="i === 0" [class.text-yellow-700]="i === 0"
                        [class.bg-gray-100]="i === 1" [class.text-gray-600]="i === 1"
                        [class.bg-orange-100]="i === 2" [class.text-orange-600]="i === 2"
                        [class.bg-blue-50]="i > 2" [class.text-blue-400]="i > 2">
                        {{ i + 1 }}
                      </span>
                    </td>
                    <td class="px-6 py-3 font-medium text-gray-800">{{ p.productName }}</td>
                    <td class="px-6 py-3 text-right text-gray-700">{{ p.totalQuantity | number }}</td>
                    <td class="px-6 py-3 text-right font-semibold text-blue-600">{{ formatAmount(p.totalRevenue) }}</td>
                  </tr>
                  <tr *ngIf="stats.charts.topProducts.length === 0">
                    <td colspan="4" class="px-6 py-8 text-center text-gray-400">Aucune donnée</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Top boutiques table -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
              <h3 class="font-semibold text-gray-800">
                <i class="fas fa-trophy text-yellow-500 mr-2"></i>Boutiques les plus actives
              </h3>
              <span class="text-xs text-gray-400">Top 5</span>
            </div>
            <div class="divide-y divide-gray-50">
              <div *ngFor="let store of stats.charts.topStores; let i = index"
                   class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div class="flex items-center space-x-3">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                    [class.bg-gradient-to-br]="true"
                    [class.from-yellow-400]="i===0" [class.to-orange-400]="i===0"
                    [class.from-gray-300]="i===1" [class.to-gray-400]="i===1"
                    [class.from-orange-300]="i===2" [class.to-orange-500]="i===2"
                    [class.from-blue-200]="i>2" [class.to-blue-300]="i>2"
                    [class.text-white]="true">
                    {{ i + 1 }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{{ store.name }}</p>
                    <p class="text-xs text-gray-400">{{ store.orders }} commandes</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900 text-sm">{{ formatAmount(store.revenue) }}</p>
                  <p class="text-xs text-gray-400">Ar</p>
                </div>
              </div>
              <div *ngIf="stats.charts.topStores.length === 0" class="px-6 py-8 text-center text-gray-400">
                Aucune boutique avec des ventes
              </div>
            </div>

            <!-- Type répartition -->
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <p class="text-xs font-semibold text-gray-500 uppercase mb-3">Répartition par type</p>
              <div class="space-y-2">
                <div *ngFor="let t of stats.charts.typeDistribution" class="flex justify-between text-xs">
                  <span class="text-gray-600">{{ getTypeLabel(t._id) }}</span>
                  <div class="flex items-center space-x-3">
                    <span class="text-gray-500">{{ t.count }} ventes</span>
                    <span class="font-semibold text-blue-600">{{ formatAmount(t.revenue) }} Ar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminStatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
    stats: any = null;
    isLoading = false;
    selectedPeriod = '30';

    private charts: any[] = [];

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadStats();
    }

    ngAfterViewInit(): void { }

    ngOnDestroy(): void {
        this.destroyCharts();
    }

    loadStats(): void {
        this.isLoading = true;
        this.destroyCharts();

        this.http.get<any>(`${environment.apiUrl}/orders/stats?period=${this.selectedPeriod}`).subscribe({
            next: (res) => {
                this.stats = res.data;
                this.isLoading = false;
                // Wait for DOM to render before drawing charts
                setTimeout(() => this.initCharts(), 100);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    destroyCharts(): void {
        this.charts.forEach(c => { try { c.destroy(); } catch { } });
        this.charts = [];
    }

    initCharts(): void {
        if (!this.stats) return;
        this.initLineChart();
        this.initDoughnutChart();
        this.initStoreBarChart();
        this.initOrdersBarChart();
    }

    initLineChart(): void {
        const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
        if (!ctx) return;
        const { labels, revenues } = this.stats.charts.dailyRevenue;
        // Show formatted dates
        const shortLabels = labels.map((l: string) => {
            const d = new Date(l);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        });
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: shortLabels,
                datasets: [{
                    label: 'Revenus (Ar)',
                    data: revenues,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointRadius: revenues.length > 60 ? 0 : 3,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#3b82f6',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 }, maxTicksLimit: 12 }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f3f4f6' },
                        ticks: {
                            font: { size: 10 },
                            callback: (v: any) => this.formatAmount(v)
                        }
                    }
                }
            }
        });
        this.charts.push(chart);
    }

    initDoughnutChart(): void {
        const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement;
        if (!ctx) return;
        const data = this.stats.charts.statusDistribution;
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map((d: any) => this.getStatusLabel(d._id)),
                datasets: [{
                    data: data.map((d: any) => d.count),
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                cutout: '70%'
            }
        });
        this.charts.push(chart);
    }

    initStoreBarChart(): void {
        const ctx = document.getElementById('storeBarChart') as HTMLCanvasElement;
        if (!ctx) return;
        const stores = this.stats.charts.topStores;
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: stores.map((s: any) => s.name.length > 14 ? s.name.substring(0, 14) + '…' : s.name),
                datasets: [{
                    label: 'Revenus (Ar)',
                    data: stores.map((s: any) => s.revenue),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.85)',
                        'rgba(16, 185, 129, 0.85)',
                        'rgba(245, 158, 11, 0.85)',
                        'rgba(239, 68, 68, 0.85)',
                        'rgba(139, 92, 246, 0.85)'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f9fafb' },
                        ticks: {
                            font: { size: 10 },
                            callback: (v: any) => this.formatAmount(v)
                        }
                    }
                }
            }
        });
        this.charts.push(chart);
    }

    initOrdersBarChart(): void {
        const ctx = document.getElementById('ordersBarChart') as HTMLCanvasElement;
        if (!ctx) return;
        const { labels, orders } = this.stats.charts.dailyRevenue;
        const shortLabels = labels.map((l: string) => {
            const d = new Date(l);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        });
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: shortLabels,
                datasets: [{
                    label: 'Commandes',
                    data: orders,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 9 }, maxTicksLimit: 12 }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f9fafb' },
                        ticks: { font: { size: 10 }, stepSize: 1 }
                    }
                }
            }
        });
        this.charts.push(chart);
    }

    // ── Helpers ────────────────────────────────────────────────────────

    formatAmount(val: number): string {
        if (!val && val !== 0) return '—';
        if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
        if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K';
        return val.toFixed(0);
    }

    getStatusLabel(status: string): string {
        const m: Record<string, string> = {
            en_attente: 'En attente', paye: 'Payée', acompte: 'Acompte',
            annule: 'Annulée', pret_pour_retrait: 'Prête', retire: 'Retirée', avoir: 'Avoir'
        };
        return m[status] || status;
    }

    getTypeLabel(type: string): string {
        const m: Record<string, string> = {
            VENTE_DIRECTE: 'Vente directe',
            RESERVATION: 'Réservation',
            COMMANDE_LIGNE: 'En ligne'
        };
        return m[type] || type;
    }

    // ── Export PDF ─────────────────────────────────────────────────────

    async exportPDF(): Promise<void> {
        if (!this.stats) return;
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const today = new Date().toLocaleDateString('fr-FR');
        const pageW = doc.internal.pageSize.getWidth();

        // Title bar
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, pageW, 28, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('MallConnect — Rapport Statistiques', 14, 12);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Généré le : ${today}  |  Période : ${this.selectedPeriod} jours`, 14, 22);

        // KPI Section
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Indicateurs Clés de Performance', 14, 40);

        const kpiData = [
            ['Revenus totaux', `${(this.stats.kpi.totalRevenue / 1000).toFixed(0)}K Ar`],
            ['Nombre de ventes', `${this.stats.kpi.totalOrders}`],
            ['Panier moyen', `${(this.stats.kpi.avgOrderValue / 1000).toFixed(0)}K Ar`],
            ['Clients uniques', `${this.stats.kpi.uniqueBuyers}`]
        ];

        let y = 48;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        kpiData.forEach(([label, val]) => {
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(14, y, 82, 10, 2, 2, 'F');
            doc.roundedRect(100, y, 80, 10, 2, 2, 'F');
            doc.setTextColor(100, 100, 100);
            doc.text(label, 18, y + 7);
            doc.setTextColor(30, 30, 30);
            doc.setFont('helvetica', 'bold');
            doc.text(val, 104, y + 7);
            doc.setFont('helvetica', 'normal');
            y += 13;
        });

        // Top Products table
        y += 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text('Top Produits Vendus', 14, y);
        y += 8;

        // Header
        doc.setFillColor(37, 99, 235);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.rect(14, y, 182, 8, 'F');
        doc.text('#', 16, y + 5.5);
        doc.text('Produit', 25, y + 5.5);
        doc.text('Qté', 140, y + 5.5);
        doc.text('Revenus (Ar)', 155, y + 5.5);
        y += 8;

        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica', 'normal');
        this.stats.charts.topProducts.slice(0, 10).forEach((p: any, i: number) => {
            if (i % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                doc.rect(14, y, 182, 8, 'F');
            }
            doc.text(String(i + 1), 16, y + 5.5);
            doc.text(p.productName?.substring(0, 38) || '—', 25, y + 5.5);
            doc.text(String(p.totalQuantity), 140, y + 5.5);
            doc.text(`${(p.totalRevenue / 1000).toFixed(0)}K`, 155, y + 5.5);
            y += 8;
        });

        // Top stores
        y += 8;
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Top Boutiques', 14, y);
        y += 8;
        doc.setFillColor(37, 99, 235);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.rect(14, y, 182, 8, 'F');
        doc.text('#', 16, y + 5.5);
        doc.text('Boutique', 25, y + 5.5);
        doc.text('Commandes', 120, y + 5.5);
        doc.text('Revenus (Ar)', 155, y + 5.5);
        y += 8;

        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica', 'normal');
        this.stats.charts.topStores.forEach((s: any, i: number) => {
            if (i % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                doc.rect(14, y, 182, 8, 'F');
            }
            doc.text(String(i + 1), 16, y + 5.5);
            doc.text(s.name?.substring(0, 34) || '—', 25, y + 5.5);
            doc.text(String(s.orders), 120, y + 5.5);
            doc.text(`${(s.revenue / 1000).toFixed(0)}K`, 155, y + 5.5);
            y += 8;
        });

        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(160, 160, 160);
            doc.text(`Page ${i} / ${pageCount} — MallConnect © ${new Date().getFullYear()}`, 14, 290);
        }

        doc.save(`mallconnect-stats-${today.replace(/\//g, '-')}.pdf`);
    }

    // ── Export Excel ───────────────────────────────────────────────────

    async exportExcel(): Promise<void> {
        if (!this.stats) return;
        const XLSX = await import('xlsx');
        const wb = XLSX.utils.book_new();
        const today = new Date().toLocaleDateString('fr-FR');

        // Sheet 1: KPIs
        const kpiRows = [
            ['MallConnect — Statistiques', `Généré le ${today}`],
            [''],
            ['Indicateur', 'Valeur'],
            ['Revenus totaux (Ar)', this.stats.kpi.totalRevenue],
            ['Nombre de ventes', this.stats.kpi.totalOrders],
            ['Panier moyen (Ar)', this.stats.kpi.avgOrderValue],
            ['Clients uniques', this.stats.kpi.uniqueBuyers]
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(kpiRows), 'KPIs');

        // Sheet 2: Revenus journaliers
        const { labels, revenues, orders } = this.stats.charts.dailyRevenue;
        const dailyRows = [['Date', 'Revenus (Ar)', 'Commandes']];
        labels.forEach((l: string, i: number) => dailyRows.push([l, revenues[i], orders[i]]));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dailyRows), 'Revenus Journaliers');

        // Sheet 3: Top produits
        const prodRows = [['#', 'Produit', 'Quantité vendue', 'Revenus (Ar)']];
        this.stats.charts.topProducts.forEach((p: any, i: number) =>
            prodRows.push([i + 1, p.productName, p.totalQuantity, p.totalRevenue || 0]));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(prodRows), 'Top Produits');

        // Sheet 4: Top boutiques
        const storeRows = [['#', 'Boutique', 'Commandes', 'Revenus (Ar)']];
        this.stats.charts.topStores.forEach((s: any, i: number) =>
            storeRows.push([i + 1, s.name, s.orders, s.revenue]));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(storeRows), 'Top Boutiques');

        XLSX.writeFile(wb, `mallconnect-stats-${today.replace(/\//g, '-')}.xlsx`);
    }
}
