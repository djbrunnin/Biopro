/* ========================================
   BIOPRO
   SUPABASE.JS
   ======================================== */

const SUPABASE_URL =
    "https://tgqetjuxmttnljtuaawm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_iQrxBgUGYxkjtmmhC-zrcg_eiAFzkvL";


window.supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


console.log(
    "BioPro: Supabase inicializado."
);