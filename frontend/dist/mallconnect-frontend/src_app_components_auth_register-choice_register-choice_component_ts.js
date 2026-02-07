"use strict";
(self["webpackChunkmallconnect_frontend"] = self["webpackChunkmallconnect_frontend"] || []).push([["src_app_components_auth_register-choice_register-choice_component_ts"],{

/***/ 3856:
/*!******************************************************************************!*\
  !*** ./src/app/components/auth/register-choice/register-choice.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RegisterChoiceComponent: () => (/* binding */ RegisterChoiceComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);




class RegisterChoiceComponent {
  constructor(router) {
    this.router = router;
  }
  selectRole(role) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/register/admin']);
        break;
      case 'boutique':
        this.router.navigate(['/register/boutique']);
        break;
      case 'acheteur':
        this.router.navigate(['/register/acheteur']);
        break;
    }
  }
  static {
    this.ɵfac = function RegisterChoiceComponent_Factory(t) {
      return new (t || RegisterChoiceComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: RegisterChoiceComponent,
      selectors: [["app-register-choice"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 40,
      vars: 0,
      consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-gradient-to-br", "from-blue-50", "to-indigo-100", "p-4"], [1, "bg-white", "rounded-2xl", "shadow-xl", "w-full", "max-w-4xl", "p-8"], [1, "text-center", "mb-8"], [1, "text-3xl", "font-bold", "text-gray-900", "mb-2"], [1, "text-gray-600"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6"], [1, "border-2", "border-gray-200", "rounded-xl", "p-6", "cursor-pointer", "hover:border-blue-500", "hover:shadow-lg", "transition-all", "duration-200", "group", 3, "click"], [1, "w-16", "h-16", "bg-blue-100", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4", "group-hover:bg-blue-500", "transition-colors"], [1, "fas", "fa-user-shield", "text-2xl", "text-blue-600", "group-hover:text-white"], [1, "text-xl", "font-semibold", "text-center", "mb-2"], [1, "text-gray-500", "text-sm", "text-center"], [1, "w-full", "mt-4", "btn-primary"], [1, "border-2", "border-gray-200", "rounded-xl", "p-6", "cursor-pointer", "hover:border-green-500", "hover:shadow-lg", "transition-all", "duration-200", "group", 3, "click"], [1, "w-16", "h-16", "bg-green-100", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4", "group-hover:bg-green-500", "transition-colors"], [1, "fas", "fa-store", "text-2xl", "text-green-600", "group-hover:text-white"], [1, "w-full", "mt-4", "btn-success"], [1, "border-2", "border-gray-200", "rounded-xl", "p-6", "cursor-pointer", "hover:border-purple-500", "hover:shadow-lg", "transition-all", "duration-200", "group", 3, "click"], [1, "w-16", "h-16", "bg-purple-100", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4", "group-hover:bg-purple-500", "transition-colors"], [1, "fas", "fa-shopping-bag", "text-2xl", "text-purple-600", "group-hover:text-white"], [1, "w-full", "mt-4", "bg-purple-600", "hover:bg-purple-700", "text-white", "font-medium", "py-2", "px-4", "rounded-lg", "transition-colors", "duration-200"], [1, "mt-8", "text-center"], ["routerLink", "/login", 1, "text-blue-600", "hover:text-blue-700", "font-medium"]],
      template: function RegisterChoiceComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "MallConnect");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Choisissez votre type de compte");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 5)(8, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RegisterChoiceComponent_Template_div_click_8_listener() {
            return ctx.selectRole("admin");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "i", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "h3", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Administrateur");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "p", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Gestion compl\u00E8te du centre commercial ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " S'inscrire ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RegisterChoiceComponent_Template_div_click_17_listener() {
            return ctx.selectRole("boutique");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "i", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "h3", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Boutique");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "p", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, " Vendez vos produits dans le centre ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "button", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, " S'inscrire ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RegisterChoiceComponent_Template_div_click_26_listener() {
            return ctx.selectRole("acheteur");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](28, "i", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "h3", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Acheteur");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "p", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, " Faites vos achats en ligne ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "button", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, " S'inscrire ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 20)(36, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, " D\u00E9j\u00E0 un compte? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "a", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, " Se connecter ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLink]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_components_auth_register-choice_register-choice_component_ts.js.map