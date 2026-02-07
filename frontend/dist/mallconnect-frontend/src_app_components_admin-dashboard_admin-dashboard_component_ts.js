"use strict";
(self["webpackChunkmallconnect_frontend"] = self["webpackChunkmallconnect_frontend"] || []).push([["src_app_components_admin-dashboard_admin-dashboard_component_ts"],{

/***/ 2557:
/*!*************************************************************************!*\
  !*** ./src/app/components/admin-dashboard/admin-dashboard.component.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminDashboardComponent: () => (/* binding */ AdminDashboardComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/auth.service */ 4796);





function AdminDashboardComponent_span_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"](" ", ctx_r0.currentUser.firstName, " ", ctx_r0.currentUser.lastName, " ");
  }
}
class AdminDashboardComponent {
  constructor(authService) {
    this.authService = authService;
    this.currentUser = null;
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  logout() {
    this.authService.logout();
  }
  static {
    this.ɵfac = function AdminDashboardComponent_Factory(t) {
      return new (t || AdminDashboardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: AdminDashboardComponent,
      selectors: [["app-admin-dashboard"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
      decls: 83,
      vars: 1,
      consts: [[1, "flex", "h-screen", "bg-gray-50"], [1, "w-64", "bg-white", "border-r", "border-gray-200"], [1, "p-6"], [1, "text-2xl", "font-bold", "text-blue-600"], [1, "text-sm", "text-gray-500"], [1, "mt-6"], [1, "sidebar-link", "active"], [1, "fas", "fa-home", "w-6"], [1, "sidebar-link"], [1, "fas", "fa-store", "w-6"], [1, "fas", "fa-calendar", "w-6"], [1, "fas", "fa-chart-bar", "w-6"], [1, "fas", "fa-map", "w-6"], [1, "absolute", "bottom-0", "w-64", "p-4", "border-t", "border-gray-200"], [1, "sidebar-link", "w-full", "text-left", "text-red-600", 3, "click"], [1, "fas", "fa-sign-out-alt", "w-6"], [1, "flex-1", "overflow-y-auto"], [1, "bg-white", "shadow-sm", "border-b", "border-gray-200"], [1, "px-8", "py-4", "flex", "justify-between", "items-center"], [1, "text-xl", "font-semibold", "text-gray-800"], [1, "flex", "items-center", "space-x-4"], ["class", "text-sm text-gray-600", 4, "ngIf"], [1, "p-8"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-6", "mb-8"], [1, "mall-card"], [1, "flex", "items-center"], [1, "p-3", "rounded-full", "bg-blue-100", "text-blue-600"], [1, "fas", "fa-store", "text-xl"], [1, "ml-4"], [1, "text-2xl", "font-bold"], [1, "p-3", "rounded-full", "bg-green-100", "text-green-600"], [1, "fas", "fa-shopping-bag", "text-xl"], [1, "p-3", "rounded-full", "bg-yellow-100", "text-yellow-600"], [1, "fas", "fa-users", "text-xl"], [1, "p-3", "rounded-full", "bg-purple-100", "text-purple-600"], [1, "fas", "fa-box", "text-xl"], [1, "text-lg", "font-semibold", "mb-4"], [1, "text-gray-500"], [1, "text-sm", "text-gray-600"]],
      template: function AdminDashboardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "aside", 1)(2, "div", 2)(3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "MallConnect");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Administration");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "nav", 5)(8, "a", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "i", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Tableau de bord");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](13, "i", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Boutiques");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "i", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "\u00C9v\u00E9nements");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "i", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "Statistiques");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](25, "i", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, "Plan du centre");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 13)(29, "button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AdminDashboardComponent_Template_button_click_29_listener() {
            return ctx.logout();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](30, "i", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, "D\u00E9connexion");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "main", 16)(34, "header", 17)(35, "div", 18)(36, "h2", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](37, "Tableau de bord Admin");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "div", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](39, AdminDashboardComponent_span_39_Template, 2, 2, "span", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "div", 22)(41, "div", 23)(42, "div", 24)(43, "div", 25)(44, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](45, "i", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "div", 28)(47, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](48, "Total Boutiques");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](49, "p", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](50, "0");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "div", 24)(52, "div", 25)(53, "div", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](54, "i", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "div", 28)(56, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](57, "Ventes Totales");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](58, "p", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](59, "0 Ar");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](60, "div", 24)(61, "div", 25)(62, "div", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](63, "i", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](64, "div", 28)(65, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](66, "Clients");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](67, "p", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](68, "0");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](69, "div", 24)(70, "div", 25)(71, "div", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](72, "i", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](73, "div", 28)(74, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](75, "Produits");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](76, "p", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](77, "0");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](78, "div", 24)(79, "h3", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](80, "Boutiques en attente d'approbation");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](81, "p", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](82, "Aucune boutique en attente pour le moment.");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](39);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.currentUser);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_components_admin-dashboard_admin-dashboard_component_ts.js.map