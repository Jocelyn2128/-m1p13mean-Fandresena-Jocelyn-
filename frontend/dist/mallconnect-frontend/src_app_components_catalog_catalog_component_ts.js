"use strict";
(self["webpackChunkmallconnect_frontend"] = self["webpackChunkmallconnect_frontend"] || []).push([["src_app_components_catalog_catalog_component_ts"],{

/***/ 7665:
/*!*********************************************************!*\
  !*** ./src/app/components/catalog/catalog.component.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CatalogComponent: () => (/* binding */ CatalogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/auth.service */ 4796);
/* harmony import */ var _services_product_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/product.service */ 6241);
/* harmony import */ var _services_store_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/store.service */ 3407);








const _c0 = () => [1, 2, 3, 4];
const _c1 = () => [1, 2, 3];
function CatalogComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 42)(1, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "button", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CatalogComponent_div_15_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r1.logout());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, " D\u00E9connexion ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r1.currentUser.firstName);
  }
}
function CatalogComponent_ng_template_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "a", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Connexion ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function CatalogComponent_div_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 46)(1, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "i", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 49)(4, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Cat\u00E9gorie");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "h4", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "Nom du produit");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "p", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, "Boutique exemple");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div", 35)(11, "span", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12, "50,000 Ar");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "button", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](14, "i", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
}
function CatalogComponent_div_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "div", 58)(3, "div", 59)(4, "div", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "i", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "h4", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "Nom de la boutique");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "p", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, "Cat\u00E9gorie \u2022 \u00C9tage 1");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11, "Description courte de la boutique...");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "button", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13, " Visiter la boutique ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
}
class CatalogComponent {
  constructor(authService, productService, storeService) {
    this.authService = authService;
    this.productService = productService;
    this.storeService = storeService;
    this.currentUser = null;
    this.products = [];
    this.stores = [];
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  ngOnInit() {
    this.loadProducts();
    this.loadStores();
  }
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: response => {
        if (response.success) {
          this.products = response.data;
        }
      },
      error: error => {
        console.error('Error loading products:', error);
      }
    });
  }
  loadStores() {
    this.storeService.getStores().subscribe({
      next: response => {
        if (response.success) {
          this.stores = response.data;
        }
      },
      error: error => {
        console.error('Error loading stores:', error);
      }
    });
  }
  logout() {
    this.authService.logout();
  }
  static {
    this.ɵfac = function CatalogComponent_Factory(t) {
      return new (t || CatalogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_product_service__WEBPACK_IMPORTED_MODULE_1__.ProductService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_store_service__WEBPACK_IMPORTED_MODULE_2__.StoreService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: CatalogComponent,
      selectors: [["app-catalog"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
      decls: 69,
      vars: 6,
      consts: [["loginBtn", ""], [1, "min-h-screen", "bg-gray-50"], [1, "bg-white", "shadow-sm", "sticky", "top-0", "z-50"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8"], [1, "flex", "justify-between", "items-center", "h-16"], [1, "flex", "items-center"], [1, "text-2xl", "font-bold", "text-blue-600"], [1, "flex", "items-center", "space-x-6"], [1, "relative"], ["type", "text", "placeholder", "Rechercher...", 1, "form-input", "w-64"], [1, "fas", "fa-search", "absolute", "right-3", "top-3", "text-gray-400"], [1, "relative", "p-2", "text-gray-600", "hover:text-blue-600"], [1, "fas", "fa-shopping-cart", "text-xl"], [1, "absolute", "-top-1", "-right-1", "bg-red-500", "text-white", "text-xs", "rounded-full", "h-5", "w-5", "flex", "items-center", "justify-center"], ["class", "flex items-center space-x-2", 4, "ngIf", "ngIfElse"], [1, "bg-gradient-to-r", "from-blue-600", "to-indigo-700", "text-white"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-16"], [1, "text-4xl", "font-bold", "mb-4"], [1, "text-xl", "text-blue-100"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-8"], [1, "mb-8"], [1, "text-xl", "font-semibold", "mb-4"], [1, "flex", "space-x-3", "overflow-x-auto", "pb-2"], [1, "px-6", "py-2", "bg-blue-600", "text-white", "rounded-full", "whitespace-nowrap"], [1, "px-6", "py-2", "bg-white", "text-gray-700", "border", "border-gray-300", "rounded-full", "whitespace-nowrap", "hover:bg-gray-50"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-xl", "font-semibold"], ["href", "#", 1, "text-blue-600", "hover:text-blue-700", "font-medium"], [1, "fas", "fa-arrow-right", "ml-1"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4", "gap-6"], ["class", "mall-card p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer", 4, "ngFor", "ngForOf"], [1, "mt-12"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "gap-6"], ["class", "mall-card p-0 overflow-hidden", 4, "ngFor", "ngForOf"], [1, "bg-white", "border-t", "border-gray-200", "mt-16"], [1, "flex", "justify-between", "items-center"], [1, "text-gray-500"], [1, "flex", "space-x-4"], ["href", "#", 1, "text-gray-400", "hover:text-gray-600"], [1, "fab", "fa-facebook", "text-xl"], [1, "fab", "fa-instagram", "text-xl"], [1, "fab", "fa-twitter", "text-xl"], [1, "flex", "items-center", "space-x-2"], [1, "text-sm", "text-gray-700"], [1, "text-sm", "text-red-600", "hover:text-red-700", 3, "click"], ["routerLink", "/login", 1, "btn-primary", "text-sm"], [1, "mall-card", "p-0", "overflow-hidden", "hover:shadow-lg", "transition-shadow", "cursor-pointer"], [1, "h-48", "bg-gray-200", "flex", "items-center", "justify-center"], [1, "fas", "fa-image", "text-gray-400", "text-4xl"], [1, "p-4"], [1, "text-xs", "text-blue-600", "font-medium"], [1, "font-semibold", "text-gray-900", "mt-1"], [1, "text-sm", "text-gray-500", "mb-2"], [1, "text-lg", "font-bold", "text-gray-900"], [1, "p-2", "bg-blue-100", "text-blue-600", "rounded-full", "hover:bg-blue-200"], [1, "fas", "fa-plus"], [1, "mall-card", "p-0", "overflow-hidden"], [1, "h-32", "bg-gradient-to-r", "from-blue-500", "to-indigo-600"], [1, "p-6"], [1, "flex", "items-center", "-mt-12", "mb-4"], [1, "h-20", "w-20", "rounded-full", "bg-white", "border-4", "border-white", "shadow-md", "flex", "items-center", "justify-center"], [1, "fas", "fa-store", "text-3xl", "text-gray-400"], [1, "font-semibold", "text-lg"], [1, "text-gray-500", "text-sm", "mb-3"], [1, "text-gray-600", "text-sm", "mb-4"], [1, "w-full", "btn-secondary", "text-sm"]],
      template: function CatalogComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 1)(1, "header", 2)(2, "div", 3)(3, "div", 4)(4, "div", 5)(5, "h1", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "MallConnect");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div", 7)(8, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](9, "input", 9)(10, "i", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](12, "i", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "span", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14, " 0 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](15, CatalogComponent_div_15_Template, 5, 1, "div", 14)(16, CatalogComponent_ng_template_16_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "div", 15)(19, "div", 16)(20, "h2", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "Bienvenue sur MallConnect");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "p", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](23, "D\u00E9couvrez les meilleures boutiques et produits de votre centre commercial");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "main", 19)(25, "div", 20)(26, "h3", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](27, "Cat\u00E9gories");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "div", 22)(29, "button", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](30, " Tous ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](31, "button", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](32, " Mode ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](33, "button", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](34, " \u00C9lectronique ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](35, "button", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](36, " Alimentation ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](37, "button", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](38, " Maison ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](39, "div")(40, "div", 25)(41, "h3", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](42, "Produits en vedette");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](43, "a", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](44, " Voir tout ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](45, "i", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](46, "div", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](47, CatalogComponent_div_47_Template, 15, 0, "div", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](48, "div", 31)(49, "div", 25)(50, "h3", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](51, "Nos boutiques");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](52, "a", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](53, " Voir tout ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](54, "i", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](55, "div", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](56, CatalogComponent_div_56_Template, 14, 0, "div", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](57, "footer", 34)(58, "div", 19)(59, "div", 35)(60, "p", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](61, "\u00A9 2024 MallConnect. Tous droits r\u00E9serv\u00E9s.");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](62, "div", 37)(63, "a", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](64, "i", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](65, "a", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](66, "i", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](67, "a", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](68, "i", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()()();
        }
        if (rf & 2) {
          const loginBtn_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](17);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](15);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.currentUser)("ngIfElse", loginBtn_r3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](32);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](4, _c0));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](5, _c1));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink]
    });
  }
}

/***/ }),

/***/ 6241:
/*!*********************************************!*\
  !*** ./src/app/services/product.service.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProductService: () => (/* binding */ ProductService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);




class ProductService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/products`;
  }
  getProducts(filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(this.apiUrl, {
      params
    });
  }
  getProduct(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createProduct(product) {
    return this.http.post(this.apiUrl, product);
  }
  updateProduct(id, product) {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }
  deleteProduct(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  static {
    this.ɵfac = function ProductService_Factory(t) {
      return new (t || ProductService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: ProductService,
      factory: ProductService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 3407:
/*!*******************************************!*\
  !*** ./src/app/services/store.service.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StoreService: () => (/* binding */ StoreService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);




class StoreService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/stores`;
  }
  getStores(filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(this.apiUrl, {
      params
    });
  }
  getStore(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createStore(store) {
    return this.http.post(this.apiUrl, store);
  }
  static {
    this.ɵfac = function StoreService_Factory(t) {
      return new (t || StoreService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: StoreService,
      factory: StoreService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_components_catalog_catalog_component_ts.js.map