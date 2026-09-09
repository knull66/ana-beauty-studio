export type Locale = "en" | "es";

export const defaultLocale: Locale = "en";
export const localeCookie = "abs-locale";

export const dictionaries = {
  en: {
    meta: {
      description: "Hair studio. A quiet portfolio of color, cut, and form.",
    },
    splash: { kicker: "The art of hair" },
    nav: {
      portfolio: "Portfolio",
      services: "Services",
      login: "Login",
      register: "Register",
      account: "Account",
      admin: "Studio",
    },
    hero: {
      kicker: "Hair studio",
      title: "Ana Beauty Studio",
      body: "Color, cut, and silhouette. A gallery designed so the image speaks first.",
      cta: "View work",
      prev: "Previous slide",
      next: "Next slide",
      slide: "Slide",
    },
    gallery: {
      kicker: "Portfolio",
      title: "Selected work",
      emptyTitle: "The gallery is quiet",
      emptyBody:
        "When images are published from the studio, they will appear here.",
      close: "Close",
      prev: "Previous",
      next: "Next",
      viewImage: "View image",
    },
    packages: {
      kicker: "Services",
      title: "Collections",
      emptyTitle: "No collections yet",
      emptyBody: "Available services will appear here once they are published.",
    },
    auth: {
      loginKicker: "Client & studio",
      loginTitle: "Sign in",
      registerKicker: "New client",
      registerTitle: "Create account",
      email: "Email",
      password: "Password",
      confirm: "Confirm password",
      name: "Full name",
      submitLogin: "Enter",
      submittingLogin: "Signing in…",
      submitRegister: "Create account",
      submittingRegister: "Creating…",
      noAccount: "New here?",
      hasAccount: "Already a client?",
      mismatch: "Passwords do not match.",
      missing: "Please complete all fields.",
      confirmEmail: "Check your email to confirm your account.",
      configured:
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable access.",
      invalid: "Incorrect email or password.",
      unconfirmed: "Confirm your email before signing in.",
      tooMany: "Too many attempts. Please wait a moment.",
      generic: "Unable to sign in. Please try again.",
      registerGeneric: "Unable to create the account. Please try again.",
      alreadyRegistered: "This email is already registered. Sign in instead.",
    },
    account: {
      kicker: "Client",
      title: "Your studio",
      signedIn: "Signed in as",
      adminCta: "Open studio dashboard",
      home: "Back to site",
      signOut: "Sign out",
    },
    admin: {
      overview: "Overview",
      portfolio: "Portfolio",
      packages: "Collections",
      site: "View site",
      signOut: "Sign out",
      panel: "Studio",
      summary: "Summary",
      images: "Images",
      packagesCount: "Collections",
      visible: "Visible",
      examples:
        "Showing sample content. What you publish will replace these items.",
      content: "Content",
      portfolioExamples: "These images are samples. Publish yours to replace them.",
      packageExamples:
        "These collections are samples. Create yours to replace them.",
    },
    notFound: {
      kicker: "404",
      title: "Page not found",
      home: "Back to home",
    },
    error: {
      kicker: "Error",
      title: "Something went wrong",
      retry: "Try again",
    },
    language: { en: "EN", es: "ES" },
  },
  es: {
    meta: {
      description:
        "Salón de belleza. Portafolio de cabello y paquetes de servicio.",
    },
    splash: { kicker: "Estética del cabello" },
    nav: {
      portfolio: "Portafolio",
      services: "Servicios",
      login: "Entrar",
      register: "Registro",
      account: "Cuenta",
      admin: "Estudio",
    },
    hero: {
      kicker: "Salón de belleza",
      title: "Ana Beauty Studio",
      body: "Color, corte y silueta. Una galería pensada para que la imagen hable primero.",
      cta: "Ver trabajo",
      prev: "Diapositiva anterior",
      next: "Diapositiva siguiente",
      slide: "Diapositiva",
    },
    gallery: {
      kicker: "Portafolio",
      title: "Trabajo seleccionado",
      emptyTitle: "La galería está en silencio",
      emptyBody:
        "Cuando se publiquen imágenes desde el estudio, aparecerán aquí.",
      close: "Cerrar",
      prev: "Anterior",
      next: "Siguiente",
      viewImage: "Ver imagen",
    },
    packages: {
      kicker: "Servicios",
      title: "Colecciones",
      emptyTitle: "Sin colecciones",
      emptyBody:
        "Los servicios disponibles se mostrarán aquí cuando se publiquen.",
    },
    auth: {
      loginKicker: "Cliente y estudio",
      loginTitle: "Iniciar sesión",
      registerKicker: "Nuevo cliente",
      registerTitle: "Crear cuenta",
      email: "Correo",
      password: "Contraseña",
      confirm: "Confirmar contraseña",
      name: "Nombre completo",
      submitLogin: "Entrar",
      submittingLogin: "Entrando…",
      submitRegister: "Crear cuenta",
      submittingRegister: "Creando…",
      noAccount: "¿Primera vez?",
      hasAccount: "¿Ya eres cliente?",
      mismatch: "Las contraseñas no coinciden.",
      missing: "Completa todos los campos.",
      confirmEmail: "Revisa tu correo para confirmar la cuenta.",
      configured:
        "Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar el acceso.",
      invalid: "Correo o contraseña incorrectos.",
      unconfirmed: "Confirma tu correo antes de entrar.",
      tooMany: "Demasiados intentos. Espera un momento.",
      generic: "No se pudo iniciar sesión. Inténtalo de nuevo.",
      registerGeneric: "No se pudo crear la cuenta. Inténtalo de nuevo.",
      alreadyRegistered: "Este correo ya está registrado. Inicia sesión.",
    },
    account: {
      kicker: "Cliente",
      title: "Tu estudio",
      signedIn: "Sesión iniciada como",
      adminCta: "Abrir panel del estudio",
      home: "Volver al sitio",
      signOut: "Salir",
    },
    admin: {
      overview: "Resumen",
      portfolio: "Portafolio",
      packages: "Colecciones",
      site: "Ver sitio",
      signOut: "Salir",
      panel: "Estudio",
      summary: "Resumen",
      images: "Imágenes",
      packagesCount: "Colecciones",
      visible: "Visibles",
      examples:
        "Mostrando contenido de ejemplo. Lo que publiques reemplazará estos datos.",
      content: "Contenido",
      portfolioExamples:
        "Estas imágenes son de ejemplo. Publica las tuyas para sustituirlas.",
      packageExamples:
        "Estas colecciones son de ejemplo. Crea las tuyas para sustituirlas.",
    },
    notFound: {
      kicker: "404",
      title: "Página no encontrada",
      home: "Volver al inicio",
    },
    error: {
      kicker: "Error",
      title: "Algo no salió bien",
      retry: "Reintentar",
    },
    language: { en: "EN", es: "ES" },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "es";
}
