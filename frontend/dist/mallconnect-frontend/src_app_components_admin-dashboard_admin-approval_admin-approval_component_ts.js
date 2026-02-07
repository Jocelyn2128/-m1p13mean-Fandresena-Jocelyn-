"use strict";
(self["webpackChunkmallconnect_frontend"] = self["webpackChunkmallconnect_frontend"] || []).push([["src_app_components_admin-dashboard_admin-approval_admin-approval_component_ts"],{

/***/ 3288:
/*!***************************************************************************************!*\
  !*** ./src/app/components/admin-dashboard/admin-approval/admin-approval.component.ts ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminApprovalComponent: () => (/* binding */ AdminApprovalComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 6443);






function AdminApprovalComponent_span_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.pendingCount, " ");
  }
}
function AdminApprovalComponent_div_58_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "i", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Aucune boutique en attente d'approbation");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
}
function AdminApprovalComponent_div_59_div_1_span_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Approuver");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function AdminApprovalComponent_div_59_div_1_span_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Traitement...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function AdminApprovalComponent_div_59_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 45)(1, "div", 46)(2, "div")(3, "h4", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "En attente");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 50)(12, "h5", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Propri\u00E9taire");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 52)(15, "div")(16, "span", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Nom:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div")(21, "span", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Email:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div")(26, "span", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "T\u00E9l\u00E9phone:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div")(31, "span", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Date de demande:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](35, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 55)(37, "button", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AdminApprovalComponent_div_59_div_1_Template_button_click_37_listener() {
      const store_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2).$implicit;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r0.approveStore(store_r3._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](38, "i", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](39, AdminApprovalComponent_div_59_div_1_span_39_Template, 2, 0, "span", 58)(40, AdminApprovalComponent_div_59_div_1_span_40_Template, 2, 0, "span", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "button", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AdminApprovalComponent_div_59_div_1_Template_button_click_41_listener() {
      const store_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2).$implicit;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r0.rejectStore(store_r3._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](42, "i", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, " Refuser ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const store_r3 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](store_r3.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate3"]("", store_r3.category, " \u2022 \u00C9tage ", store_r3.location.floor, " \u2022 Local ", store_r3.location.shopNumber, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](store_r3.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", store_r3.owner.firstName, " ", store_r3.owner.lastName, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](store_r3.owner.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](store_r3.owner.phone);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](35, 14, store_r3.createdAt, "dd/MM/yyyy"));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r0.processingId === store_r3._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.processingId !== store_r3._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.processingId === store_r3._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r0.processingId === store_r3._id);
  }
}
function AdminApprovalComponent_div_59_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, AdminApprovalComponent_div_59_div_1_Template, 44, 17, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.pendingStores);
  }
}
class AdminApprovalComponent {
  constructor(http) {
    this.http = http;
    this.pendingStores = [];
    this.pendingCount = 0;
    this.approvedToday = 0;
    this.rejectedCount = 0;
    this.processingId = null;
  }
  ngOnInit() {
    this.loadPendingStores();
    this.loadStats();
  }
  loadPendingStores() {
    // Simulation de données pour démonstration
    // Remplacer par l'appel API réel
    this.pendingStores = [{
      _id: '1',
      name: 'Boutique Électronique Plus',
      description: 'Vente de produits électroniques et accessoires high-tech',
      category: 'electronique',
      location: {
        floor: '1',
        shopNumber: 'B-15'
      },
      owner: {
        firstName: 'Jean',
        lastName: 'Rakoto',
        email: 'jean.rakoto@email.com',
        phone: '034 12 345 67'
      },
      status: 'pending_approval',
      createdAt: new Date().toISOString()
    }, {
      _id: '2',
      name: 'Fashion Style',
      description: 'Boutique de vêtements tendance pour hommes et femmes',
      category: 'mode',
      location: {
        floor: 'RDC',
        shopNumber: 'A-08'
      },
      owner: {
        firstName: 'Marie',
        lastName: 'Rasoanirina',
        email: 'marie.fashion@email.com',
        phone: '034 98 765 43'
      },
      status: 'pending_approval',
      createdAt: new Date().toISOString()
    }];
    this.pendingCount = this.pendingStores.length;
  }
  loadStats() {
    // Simulation de statistiques
    this.approvedToday = 3;
    this.rejectedCount = 1;
  }
  approveStore(storeId) {
    this.processingId = storeId;
    // Appel API pour approuver
    // this.http.put(`${environment.apiUrl}/stores/${storeId}/approve`, {}).subscribe({
    //   next: () => {
    //     this.pendingStores = this.pendingStores.filter(s => s._id !== storeId);
    //     this.pendingCount--;
    //     this.approvedToday++;
    //     this.processingId = null;
    //   },
    //   error: () => {
    //     this.processingId = null;
    //   }
    // });
    // Simulation
    setTimeout(() => {
      this.pendingStores = this.pendingStores.filter(s => s._id !== storeId);
      this.pendingCount--;
      this.approvedToday++;
      this.processingId = null;
    }, 1000);
  }
  rejectStore(storeId) {
    this.processingId = storeId;
    // Appel API pour refuser
    // this.http.put(`${environment.apiUrl}/stores/${storeId}/reject`, {}).subscribe({
    //   next: () => {
    //     this.pendingStores = this.pendingStores.filter(s => s._id !== storeId);
    //     this.pendingCount--;
    //     this.rejectedCount++;
    //     this.processingId = null;
    //   },
    //   error: () => {
    //     this.processingId = null;
    //   }
    // });
    // Simulation
    setTimeout(() => {
      this.pendingStores = this.pendingStores.filter(s => s._id !== storeId);
      this.pendingCount--;
      this.rejectedCount++;
      this.processingId = null;
    }, 1000);
  }
  static {
    this.ɵfac = function AdminApprovalComponent_Factory(t) {
      return new (t || AdminApprovalComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AdminApprovalComponent,
      selectors: [["app-admin-approval"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 60,
      vars: 6,
      consts: [[1, "flex", "h-screen", "bg-gray-50"], [1, "w-64", "bg-white", "border-r", "border-gray-200"], [1, "p-6"], [1, "text-2xl", "font-bold", "text-blue-600"], [1, "text-sm", "text-gray-500"], [1, "mt-6"], ["routerLink", "/admin", 1, "sidebar-link"], [1, "fas", "fa-home", "w-6"], ["routerLink", "/admin/approvals", 1, "sidebar-link", "active"], [1, "fas", "fa-check-circle", "w-6"], ["class", "ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5", 4, "ngIf"], ["routerLink", "/admin/stores", 1, "sidebar-link"], [1, "fas", "fa-store", "w-6"], [1, "flex-1", "overflow-y-auto"], [1, "bg-white", "shadow-sm", "border-b", "border-gray-200"], [1, "px-8", "py-4", "flex", "justify-between", "items-center"], [1, "text-xl", "font-semibold", "text-gray-800"], [1, "p-8"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6", "mb-8"], [1, "mall-card", "bg-yellow-50", "border-yellow-200"], [1, "flex", "items-center"], [1, "p-3", "rounded-full", "bg-yellow-100", "text-yellow-600"], [1, "fas", "fa-clock", "text-xl"], [1, "ml-4"], [1, "text-sm", "text-yellow-700"], [1, "text-2xl", "font-bold", "text-yellow-800"], [1, "mall-card", "bg-green-50", "border-green-200"], [1, "p-3", "rounded-full", "bg-green-100", "text-green-600"], [1, "fas", "fa-check", "text-xl"], [1, "text-sm", "text-green-700"], [1, "text-2xl", "font-bold", "text-green-800"], [1, "mall-card", "bg-red-50", "border-red-200"], [1, "p-3", "rounded-full", "bg-red-100", "text-red-600"], [1, "fas", "fa-times", "text-xl"], [1, "text-sm", "text-red-700"], [1, "text-2xl", "font-bold", "text-red-800"], [1, "mall-card"], [1, "text-lg", "font-semibold", "mb-4"], ["class", "text-center py-8 text-gray-500", 4, "ngIf"], ["class", "space-y-4", 4, "ngIf"], [1, "ml-auto", "bg-red-500", "text-white", "text-xs", "rounded-full", "px-2", "py-0.5"], [1, "text-center", "py-8", "text-gray-500"], [1, "fas", "fa-check-circle", "text-5xl", "text-green-400", "mb-4"], [1, "space-y-4"], ["class", "border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow", 4, "ngFor", "ngForOf"], [1, "border", "border-gray-200", "rounded-lg", "p-6", "hover:shadow-md", "transition-shadow"], [1, "flex", "justify-between", "items-start", "mb-4"], [1, "text-lg", "font-semibold", "text-gray-900"], [1, "badge", "badge-warning"], [1, "text-gray-600", "mb-4"], [1, "bg-gray-50", "rounded-lg", "p-4", "mb-4"], [1, "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "grid", "grid-cols-2", "gap-4", "text-sm"], [1, "text-gray-500"], [1, "ml-2", "font-medium"], [1, "flex", "space-x-3"], [1, "flex-1", "btn-success", 3, "click", "disabled"], [1, "fas", "fa-check", "mr-2"], [4, "ngIf"], [1, "flex-1", "btn-danger", 3, "click", "disabled"], [1, "fas", "fa-times", "mr-2"]],
      template: function AdminApprovalComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "aside", 1)(2, "div", 2)(3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "MallConnect");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Administration");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "nav", 5)(8, "a", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "i", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Tableau de bord");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "i", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Approbations");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](16, AdminApprovalComponent_span_16_Template, 2, 1, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "a", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "i", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Boutiques");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "main", 13)(22, "header", 14)(23, "div", 15)(24, "h2", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "Approbation des Boutiques");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 17)(27, "div", 18)(28, "div", 19)(29, "div", 20)(30, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](31, "i", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 23)(33, "p", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "En attente");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "p", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 26)(38, "div", 20)(39, "div", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](40, "i", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 23)(42, "p", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "Approuv\u00E9es aujourd'hui");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "p", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "div", 31)(47, "div", 20)(48, "div", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](49, "i", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "div", 23)(51, "p", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "Refus\u00E9es");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "p", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "div", 36)(56, "h3", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Boutiques en attente d'approbation");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](58, AdminApprovalComponent_div_58_Template, 4, 0, "div", 38)(59, AdminApprovalComponent_div_59_Template, 2, 1, "div", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](16);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.pendingCount > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](20);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.pendingStores.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.approvedToday);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.rejectedCount);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.pendingStores.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.pendingStores.length > 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.DatePipe, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_components_admin-dashboard_admin-approval_admin-approval_component_ts.js.map