"use strict";
(self["webpackChunkmallconnect_frontend"] = self["webpackChunkmallconnect_frontend"] || []).push([["src_app_components_pos-system_pos-system_component_ts"],{

/***/ 5803:
/*!***************************************************************!*\
  !*** ./src/app/components/pos-system/pos-system.component.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PosSystemComponent: () => (/* binding */ PosSystemComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/auth.service */ 4796);





function PosSystemComponent_span_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"](" ", ctx_r0.currentUser.firstName, " ", ctx_r0.currentUser.lastName, " ");
  }
}
class PosSystemComponent {
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
    this.ɵfac = function PosSystemComponent_Factory(t) {
      return new (t || PosSystemComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: PosSystemComponent,
      selectors: [["app-pos-system"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
      decls: 79,
      vars: 1,
      consts: [[1, "flex", "h-screen", "bg-gray-50"], [1, "w-64", "bg-white", "border-r", "border-gray-200"], [1, "p-6"], [1, "text-2xl", "font-bold", "text-blue-600"], [1, "text-sm", "text-gray-500"], [1, "mt-6"], [1, "sidebar-link", "active"], [1, "fas", "fa-cash-register", "w-6"], [1, "sidebar-link"], [1, "fas", "fa-box", "w-6"], [1, "fas", "fa-history", "w-6"], [1, "fas", "fa-chart-line", "w-6"], [1, "absolute", "bottom-0", "w-64", "p-4", "border-t", "border-gray-200"], [1, "sidebar-link", "w-full", "text-left", "text-red-600", 3, "click"], [1, "fas", "fa-sign-out-alt", "w-6"], [1, "flex-1", "overflow-y-auto"], [1, "bg-white", "shadow-sm", "border-b", "border-gray-200"], [1, "px-8", "py-4", "flex", "justify-between", "items-center"], [1, "text-xl", "font-semibold", "text-gray-800"], [1, "flex", "items-center", "space-x-4"], ["class", "text-sm text-gray-600", 4, "ngIf"], [1, "p-8"], [1, "grid", "grid-cols-1", "lg:grid-cols-3", "gap-8"], [1, "lg:col-span-2"], [1, "mall-card", "mb-6"], [1, "flex", "space-x-4"], ["type", "text", "placeholder", "Rechercher un produit...", 1, "form-input", "flex-1"], [1, "btn-primary"], [1, "fas", "fa-search", "mr-2"], [1, "grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "gap-4"], [1, "mall-card", "p-4", "cursor-pointer", "hover:shadow-md", "transition-shadow"], [1, "h-32", "bg-gray-200", "rounded-lg", "mb-3", "flex", "items-center", "justify-center"], [1, "fas", "fa-image", "text-gray-400", "text-3xl"], [1, "font-medium", "text-sm"], [1, "text-blue-600", "font-bold"], [1, "text-xs", "text-gray-500"], [1, "mall-card"], [1, "text-lg", "font-semibold", "mb-4"], [1, "space-y-3", "mb-4"], [1, "text-gray-500", "text-center", "py-8"], [1, "border-t", "pt-4"], [1, "flex", "justify-between", "mb-2"], [1, "text-gray-600"], [1, "font-medium"], [1, "flex", "justify-between", "mb-4", "text-lg", "font-bold"], ["disabled", "", 1, "w-full", "btn-success", "mb-2"], [1, "fas", "fa-check", "mr-2"], [1, "w-full", "btn-secondary"], [1, "fas", "fa-trash", "mr-2"], [1, "text-sm", "text-gray-600"]],
      template: function PosSystemComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "aside", 1)(2, "div", 2)(3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "MallConnect");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Syst\u00E8me de caisse");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "nav", 5)(8, "a", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "i", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Caisse");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](13, "i", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Produits");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "i", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "Historique");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "i", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "Rapports");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "div", 12)(25, "button", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PosSystemComponent_Template_button_click_25_listener() {
            return ctx.logout();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](26, "i", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28, "D\u00E9connexion");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "main", 15)(30, "header", 16)(31, "div", 17)(32, "h2", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, "Point de Vente");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "div", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](35, PosSystemComponent_span_35_Template, 2, 2, "span", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "div", 21)(37, "div", 22)(38, "div", 23)(39, "div", 24)(40, "div", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](41, "input", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "button", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](43, "i", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](44, " Rechercher ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](45, "div", 29)(46, "div", 30)(47, "div", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](48, "i", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](49, "h4", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](50, "Produit exemple");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "p", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](52, "25,000 Ar");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](53, "p", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](54, "Stock: 10");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "div")(56, "div", 36)(57, "h3", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](58, "Panier");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](59, "div", 38)(60, "p", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](61, "Panier vide");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](62, "div", 40)(63, "div", 41)(64, "span", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](65, "Sous-total");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](66, "span", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](67, "0 Ar");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](68, "div", 44)(69, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](70, "Total");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](71, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](72, "0 Ar");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](73, "button", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](74, "i", 46);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](75, " Valider la vente ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](76, "button", 47);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](77, "i", 48);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](78, " Vider le panier ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](35);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.currentUser);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_components_pos-system_pos-system_component_ts.js.map