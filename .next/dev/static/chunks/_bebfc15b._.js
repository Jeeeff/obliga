(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/theme-provider.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/i18n.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "I18nProvider",
    ()=>I18nProvider,
    "useI18n",
    ()=>useI18n
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const I18nContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const translations = {
    en: {
        // Sidebar
        dashboard: "Dashboard",
        clients: "Clients",
        obligations: "Obligations",
        activity: "Activity",
        reports: "Reports",
        settings: "Settings",
        // Status
        pending: "Pending",
        submitted: "Submitted",
        under_review: "Under Review",
        approved: "Approved",
        overdue: "Overdue",
        at_risk: "At Risk",
        completed: "Completed",
        // Dashboard
        total_obligations: "Total Obligations",
        view_recommendations: "View recommendations",
        openclaw_insight: "OpenClaw Insight",
        // Actions
        mark_as_submitted: "Mark as Submitted",
        approve: "Approve",
        request_changes: "Request Changes",
        sign_in: "Sign in",
        email: "Email",
        password: "Password",
        welcome_back: "Welcome back",
        enter_credentials: "Enter your credentials to access your account",
        // General
        search: "Search...",
        theme: "Theme",
        language: "Language",
        profile: "Profile",
        workspace: "Workspace",
        logout: "Log out"
    },
    pt: {
        // Sidebar
        dashboard: "Painel",
        clients: "Clientes",
        obligations: "Obrigações",
        activity: "Atividade",
        reports: "Relatórios",
        settings: "Configurações",
        // Status
        pending: "Pendente",
        submitted: "Enviado",
        under_review: "Em Análise",
        approved: "Aprovado",
        overdue: "Atrasado",
        at_risk: "Em Risco",
        completed: "Concluído",
        // Dashboard
        total_obligations: "Total de Obrigações",
        view_recommendations: "Ver recomendações",
        openclaw_insight: "Insight OpenClaw",
        // Actions
        mark_as_submitted: "Marcar como Enviado",
        approve: "Aprovar",
        request_changes: "Solicitar Alterações",
        sign_in: "Entrar",
        email: "E-mail",
        password: "Senha",
        welcome_back: "Bem-vindo de volta",
        enter_credentials: "Insira suas credenciais para acessar sua conta",
        // General
        search: "Buscar...",
        theme: "Tema",
        language: "Idioma",
        profile: "Perfil",
        workspace: "Espaço de Trabalho",
        logout: "Sair"
    }
};
function I18nProvider({ children }) {
    _s();
    const [language, setLanguageState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("pt");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "I18nProvider.useEffect": ()=>{
            const saved = localStorage.getItem("language");
            if (saved && (saved === "en" || saved === "pt")) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLanguageState(saved);
            }
            setMounted(true);
        }
    }["I18nProvider.useEffect"], []);
    const setLanguage = (lang)=>{
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };
    const t = (key)=>{
        return translations[language][key] || key;
    };
    if (!mounted) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(I18nContext.Provider, {
        value: {
            language,
            setLanguage,
            t
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/i18n.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_s(I18nProvider, "Db3r/s1a26WiTzjFDHcoSQryKkM=");
_c = I18nProvider;
function useI18n() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(I18nContext);
    if (context === undefined) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
}
_s1(useI18n, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "I18nProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mockActivities",
    ()=>mockActivities,
    "mockClients",
    ()=>mockClients,
    "mockObligations",
    ()=>mockObligations,
    "mockUsers",
    ()=>mockUsers
]);
const mockUsers = [
    {
        id: "u1",
        name: "Alex Silva",
        email: "alex@obliga.com",
        avatar: "https://i.pravatar.cc/150?u=u1",
        role: "ADMIN"
    },
    {
        id: "u2",
        name: "Beatriz Costa",
        email: "bia@obliga.com",
        avatar: "https://i.pravatar.cc/150?u=u2",
        role: "CLIENT"
    }
];
const mockClients = [
    {
        id: "c1",
        name: "TechSolutions Ltda",
        email: "contact@techsolutions.com",
        logo: "TS",
        status: "Active"
    },
    {
        id: "c2",
        name: "Global Ventures",
        email: "info@globalventures.com",
        logo: "GV",
        status: "Active"
    },
    {
        id: "c3",
        name: "Padaria do João",
        email: "joao@padaria.com",
        logo: "PJ",
        status: "Active"
    }
];
const mockObligations = [
    {
        id: "o1",
        title: "Imposto de Renda Mensal",
        client: "TechSolutions Ltda",
        clientId: "c1",
        type: "Payment",
        dueDate: "2026-02-10",
        status: "PENDING",
        description: "Pagamento mensal do imposto de renda corporativo."
    },
    {
        id: "o2",
        title: "Relatório Financeiro Q1",
        client: "Global Ventures",
        clientId: "c2",
        type: "Document",
        dueDate: "2026-02-15",
        status: "UNDER_REVIEW",
        description: "Relatório consolidado do primeiro trimestre."
    },
    {
        id: "o3",
        title: "Alvará de Funcionamento",
        client: "Padaria do João",
        clientId: "c3",
        type: "Approval",
        dueDate: "2026-01-30",
        status: "OVERDUE",
        description: "Renovação do alvará anual."
    },
    {
        id: "o4",
        title: "Folha de Pagamento",
        client: "TechSolutions Ltda",
        clientId: "c1",
        type: "Payment",
        dueDate: "2026-02-05",
        status: "APPROVED"
    },
    {
        id: "o5",
        title: "Contrato Social Atualizado",
        client: "Global Ventures",
        clientId: "c2",
        type: "Document",
        dueDate: "2026-02-20",
        status: "CHANGES_REQUESTED",
        description: "Pendente assinatura dos sócios."
    },
    {
        id: "o6",
        title: "DAS Simples Nacional",
        client: "Padaria do João",
        clientId: "c3",
        type: "Payment",
        dueDate: "2026-02-20",
        status: "PENDING"
    }
];
const mockActivities = [
    {
        id: "a1",
        user: "Alex Silva",
        userAvatar: "https://i.pravatar.cc/150?u=u1",
        action: "approved",
        target: "Folha de Pagamento",
        timestamp: "2 hours ago",
        type: "approve"
    },
    {
        id: "a2",
        user: "Beatriz Costa",
        userAvatar: "https://i.pravatar.cc/150?u=u2",
        action: "uploaded document for",
        target: "Relatório Financeiro Q1",
        timestamp: "5 hours ago",
        type: "update"
    },
    {
        id: "a3",
        user: "System",
        userAvatar: "",
        action: "flagged as overdue",
        target: "Alvará de Funcionamento",
        timestamp: "1 day ago",
        type: "update"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/store-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StoreProvider",
    ()=>StoreProvider,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const StoreContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function StoreProvider({ children }) {
    _s();
    const [role, setRoleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("CLIENT");
    const [obligations, setObligations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockObligations"]);
    const [clients, setClients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockClients"]);
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockActivities"]);
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load role from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreProvider.useEffect": ()=>{
            const savedRole = localStorage.getItem("obliga-role");
            if (savedRole && (savedRole === "CLIENT" || savedRole === "ADMIN")) {
                setRoleState(savedRole);
            }
            setIsInitialized(true);
        }
    }["StoreProvider.useEffect"], []);
    // Save role to localStorage
    const setRole = (newRole)=>{
        setRoleState(newRole);
        localStorage.setItem("obliga-role", newRole);
    };
    // Check for overdue obligations on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreProvider.useEffect": ()=>{
            if (!isInitialized) return;
            const today = new Date().toISOString().split("T")[0];
            setObligations({
                "StoreProvider.useEffect": (prev)=>prev.map({
                        "StoreProvider.useEffect": (obl)=>{
                            if (obl.dueDate < today && obl.status !== "APPROVED" && obl.status !== "SUBMITTED" && obl.status !== "UNDER_REVIEW") {
                                // Logic: If due date passed and not approved/submitted/under review?
                                // Prompt says: "OVERDUE is computed automatically if dueDate < today and status is not APPROVED"
                                // Typically if it's submitted, it's not overdue in terms of "client action needed" but might be "late submission".
                                // However, prompt says "if dueDate < today and status is not APPROVED".
                                // Let's stick to strict prompt: status is not APPROVED -> OVERDUE.
                                // But if I just submitted it today (and it was due yesterday), does it become overdue?
                                // Maybe we should only mark as overdue if it's PENDING or CHANGES_REQUESTED.
                                // If it is SUBMITTED or UNDER_REVIEW, the client has done their part.
                                // Prompt says "OVERDUE is computed automatically if dueDate < today and status is not APPROVED".
                                // This implies even SUBMITTED could be OVERDUE? That's harsh. 
                                // Usually "Overdue" means "Action not taken by due date".
                                // I will assume PENDING or CHANGES_REQUESTED -> OVERDUE.
                                if (obl.status === "PENDING" || obl.status === "CHANGES_REQUESTED") {
                                    return {
                                        ...obl,
                                        status: "OVERDUE"
                                    };
                                }
                            }
                            return obl;
                        }
                    }["StoreProvider.useEffect"])
            }["StoreProvider.useEffect"]);
        }
    }["StoreProvider.useEffect"], [
        isInitialized
    ]);
    const updateObligationStatus = (id, status)=>{
        setObligations((prev)=>prev.map((o)=>o.id === id ? {
                    ...o,
                    status
                } : o));
        // Add activity log
        const obl = obligations.find((o)=>o.id === id);
        if (obl) {
            const newActivity = {
                id: `act-${Date.now()}`,
                user: role === "ADMIN" ? "Alex Silva" : "Beatriz Costa",
                userAvatar: role === "ADMIN" ? "https://i.pravatar.cc/150?u=u1" : "https://i.pravatar.cc/150?u=u2",
                action: `changed status to ${status}`,
                target: obl.title,
                timestamp: "Just now",
                type: "update"
            };
            setActivities((prev)=>[
                    newActivity,
                    ...prev
                ]);
        }
    };
    const addClient = (client)=>{
        setClients((prev)=>[
                ...prev,
                client
            ]);
    };
    const addActivity = (activity)=>{
        setActivities((prev)=>[
                activity,
                ...prev
            ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StoreContext.Provider, {
        value: {
            role,
            setRole,
            obligations,
            clients,
            activities,
            updateObligationStatus,
            addClient,
            addActivity
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/store-context.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_s(StoreProvider, "UkjrI+Com9xTtTCfxVqILPGtsTA=");
_c = StoreProvider;
function useStore() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
_s1(useStore, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "StoreProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>J,
    "useTheme",
    ()=>z
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
var M = (e, i, s, u, m, a, l, h)=>{
    let d = document.documentElement, w = [
        "light",
        "dark"
    ];
    function p(n) {
        (Array.isArray(e) ? e : [
            e
        ]).forEach((y)=>{
            let k = y === "class", S = k && a ? m.map((f)=>a[f] || f) : m;
            k ? (d.classList.remove(...S), d.classList.add(a && a[n] ? a[n] : n)) : d.setAttribute(y, n);
        }), R(n);
    }
    function R(n) {
        h && w.includes(n) && (d.style.colorScheme = n);
    }
    function c() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    if (u) p(u);
    else try {
        let n = localStorage.getItem(i) || s, y = l && n === "system" ? c() : n;
        p(y);
    } catch (n) {}
};
var b = [
    "light",
    "dark"
], I = "(prefers-color-scheme: dark)", O = typeof window == "undefined", x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](void 0), U = {
    setTheme: (e)=>{},
    themes: []
}, z = ()=>{
    var e;
    return (e = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](x)) != null ? e : U;
}, J = (e)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](x) ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, e.children) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](V, {
        ...e
    }), N = [
    "light",
    "dark"
], V = ({ forcedTheme: e, disableTransitionOnChange: i = !1, enableSystem: s = !0, enableColorScheme: u = !0, storageKey: m = "theme", themes: a = N, defaultTheme: l = s ? "system" : "light", attribute: h = "data-theme", value: d, children: w, nonce: p, scriptProps: R })=>{
    let [c, n] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        "V.useState": ()=>H(m, l)
    }["V.useState"]), [T, y] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        "V.useState": ()=>c === "system" ? E() : c
    }["V.useState"]), k = d ? Object.values(d) : a, S = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "V.useCallback[S]": (o)=>{
            let r = o;
            if (!r) return;
            o === "system" && s && (r = E());
            let v = d ? d[r] : r, C = i ? W(p) : null, P = document.documentElement, L = {
                "V.useCallback[S].L": (g)=>{
                    g === "class" ? (P.classList.remove(...k), v && P.classList.add(v)) : g.startsWith("data-") && (v ? P.setAttribute(g, v) : P.removeAttribute(g));
                }
            }["V.useCallback[S].L"];
            if (Array.isArray(h) ? h.forEach(L) : L(h), u) {
                let g = b.includes(l) ? l : null, D = b.includes(r) ? r : g;
                P.style.colorScheme = D;
            }
            C == null || C();
        }
    }["V.useCallback[S]"], [
        p
    ]), f = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "V.useCallback[f]": (o)=>{
            let r = typeof o == "function" ? o(c) : o;
            n(r);
            try {
                localStorage.setItem(m, r);
            } catch (v) {}
        }
    }["V.useCallback[f]"], [
        c
    ]), A = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "V.useCallback[A]": (o)=>{
            let r = E(o);
            y(r), c === "system" && s && !e && S("system");
        }
    }["V.useCallback[A]"], [
        c,
        e
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "V.useEffect": ()=>{
            let o = window.matchMedia(I);
            return o.addListener(A), A(o), ({
                "V.useEffect": ()=>o.removeListener(A)
            })["V.useEffect"];
        }
    }["V.useEffect"], [
        A
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "V.useEffect": ()=>{
            let o = {
                "V.useEffect.o": (r)=>{
                    r.key === m && (r.newValue ? n(r.newValue) : f(l));
                }
            }["V.useEffect.o"];
            return window.addEventListener("storage", o), ({
                "V.useEffect": ()=>window.removeEventListener("storage", o)
            })["V.useEffect"];
        }
    }["V.useEffect"], [
        f
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "V.useEffect": ()=>{
            S(e != null ? e : c);
        }
    }["V.useEffect"], [
        e,
        c
    ]);
    let Q = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "V.useMemo[Q]": ()=>({
                theme: c,
                setTheme: f,
                forcedTheme: e,
                resolvedTheme: c === "system" ? T : c,
                themes: s ? [
                    ...a,
                    "system"
                ] : a,
                systemTheme: s ? T : void 0
            })
    }["V.useMemo[Q]"], [
        c,
        f,
        e,
        T,
        s,
        a
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](x.Provider, {
        value: Q
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](_, {
        forcedTheme: e,
        storageKey: m,
        attribute: h,
        enableSystem: s,
        enableColorScheme: u,
        defaultTheme: l,
        value: d,
        themes: a,
        nonce: p,
        scriptProps: R
    }), w);
}, _ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"](({ forcedTheme: e, storageKey: i, attribute: s, enableSystem: u, enableColorScheme: m, defaultTheme: a, value: l, themes: h, nonce: d, scriptProps: w })=>{
    let p = JSON.stringify([
        s,
        i,
        a,
        e,
        h,
        l,
        u,
        m
    ]).slice(1, -1);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("script", {
        ...w,
        suppressHydrationWarning: !0,
        nonce: typeof window == "undefined" ? d : "",
        dangerouslySetInnerHTML: {
            __html: `(${M.toString()})(${p})`
        }
    });
}), H = (e, i)=>{
    if (O) return;
    let s;
    try {
        s = localStorage.getItem(e) || void 0;
    } catch (u) {}
    return s || i;
}, W = (e)=>{
    let i = document.createElement("style");
    return e && i.setAttribute("nonce", e), i.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")), document.head.appendChild(i), ()=>{
        window.getComputedStyle(document.body), setTimeout(()=>{
            document.head.removeChild(i);
        }, 1);
    };
}, E = (e)=>(e || (e = window.matchMedia(I)), e.matches ? "dark" : "light");
;
}),
]);

//# sourceMappingURL=_bebfc15b._.js.map