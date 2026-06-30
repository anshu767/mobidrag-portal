require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { Resend } = require("resend");

const app = express();

// ─── Middleware (must come before routes) ─────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Env var validation (fail loud, not silent) ────────────────────────────────
// If these are missing/misnamed on Render, every Supabase call below will fail
// with a vague error. Log clearly at boot so it's obvious in Render logs.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL) {
  console.error("❌ Missing env var: SUPABASE_URL — set this in Render's Environment tab.");
}
if (!SUPABASE_KEY) {
  console.error("❌ Missing env var: SUPABASE_KEY — set this in Render's Environment tab.");
}
console.log("SUPABASE_URL:", SUPABASE_URL ? "FOUND" : "NOT FOUND");
console.log("SUPABASE_KEY:", SUPABASE_KEY ? "FOUND" : "NOT FOUND");

let supabase;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (err) {
  console.error("❌ Failed to create Supabase client:", err.message);
  // Don't crash the whole process — let routes return clear 500s instead of
  // the server failing to boot, which is harder to diagnose from Render logs.
  supabase = null;
}

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("API KEY:", process.env.RESEND_API_KEY ? "FOUND" : "NOT FOUND");

// Small helper so every route can bail out clearly if the client never initialized
function requireSupabase(res) {
  if (!supabase) {
    res.status(500).json({
      success: false,
      message: "Supabase client not initialized — check SUPABASE_URL / SUPABASE_KEY env vars on the server.",
    });
    return false;
  }
  return true;
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Server running with Supabase 🚀");
});

// ─── Test route ───────────────────────────────────────────────────────────────
app.get("/api/test", async (req, res) => {
  const { data, error } = await supabase
    .from("partners")
    .select("*");

  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }

  res.json({
    success: true,
    data,
  });
});

// ─── Dashboard ────────────────────────────────────────────────────────────────
app.get("/api/dashboard", async (req, res) => {
  try {
    const { data: partners, error: partnersError } = await supabase
      .from("partners")
      .select("*");

    if (partnersError) throw partnersError;

    const { data: deals, error: dealsError } = await supabase
      .from("deals")
      .select("id, stage, commission_amount, created_at");

    if (dealsError) throw dealsError;

    const STAGE_LABELS = ["Contacted", "Demo scheduled", "Demo done", "Negotiating", "Won"];
    const stageToNum = (s) => {
      if (typeof s === "number") return s;
      const i = STAGE_LABELS.indexOf(s);
      return i >= 0 ? i + 1 : 1;
    };

    const pendingApprovals = deals.filter((d) => stageToNum(d.stage) < 5).length;

    const now = new Date();
    const monthlyLeads = deals.filter((d) => {
      const created = new Date(d.created_at);
      return (
        created.getFullYear() === now.getFullYear() &&
        created.getMonth() === now.getMonth()
      );
    }).length;

    const monthlyEarned = deals
      .filter((d) => {
        const created = new Date(d.created_at);
        return (
          stageToNum(d.stage) === 5 &&
          created.getFullYear() === now.getFullYear() &&
          created.getMonth() === now.getMonth()
        );
      })
      .reduce((sum, d) => sum + (parseFloat(d.commission_amount) || 0), 0);

    const monthlyTarget = 3000;

    res.json({
      activePartners: partners.length,
      pendingApprovals,
      monthlyLeads,
      monthlyEarned,
      monthlyTarget,
      partner: partners[0] || null,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Deals ────────────────────────────────────────────────────────────────────
app.get("/api/deals", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      deals: data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.post("/api/deals", async (req, res) => {
  try {
    console.log(req.body);

    const {
      brand_name,
      partner_id,
      shopify_store_url,
      industry,
      monthly_orders,
      monthly_revenue,
      has_app,
      contact_name,
      contact_role,
      contact_email,
      contact_phone,
      contact_linkedin,
      best_time,
      mobile_traffic,
      reasons,
      notes,
      stage,
      plan,
    } = req.body;

    let commission_amount = null;

    switch ((plan || "").toLowerCase()) {
      case "basic":
        commission_amount = 358;
        break;
      case "starter":
        commission_amount = 538;
        break;
      case "growth":
        commission_amount = 898;
        break;
      case "enterprise":
        commission_amount = 1170;
        break;
      default:
        commission_amount = null;
    }

    const { data, error } = await supabase
      .from("deals")
      .insert([
        {
          brand_name,
          partner_id: partner_id || 1,
          shopify_store_url,
          industry: industry || null,
          monthly_orders: monthly_orders || null,
          monthly_revenue: monthly_revenue || null,
          has_app: has_app || null,
          contact_name: contact_name || null,
          contact_role: contact_role || null,
          contact_email: contact_email || null,
          contact_phone: contact_phone || null,
          contact_linkedin: contact_linkedin || null,
          best_time: best_time || null,
          mobile_traffic: mobile_traffic || null,
          reasons: Array.isArray(reasons)
            ? reasons.join(", ")
            : reasons || null,
          notes: notes || null,
          stage: stage || 1,
          plan,
          commission_amount,
        },
      ])
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Deal registered successfully",
      deal: data[0],
    });

  } catch (err) {
    console.log("Server Error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Update deal stage (legacy PATCH — kept for backward compat)
app.patch("/api/deals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    const { data, error } = await supabase
      .from("deals")
      .update({ stage })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Stage updated successfully",
      deal: data[0],
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Update deal stage (new canonical endpoint)
app.put("/api/deals/:id/stage", async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    if (!stage) {
      return res.status(400).json({
        success: false,
        error: "stage is required",
      });
    }

    const { data, error } = await supabase
      .from("deals")
      .update({ stage })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Stage updated successfully",
      deal: data[0],
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ─── Applications ─────────────────────────────────────────────────────────────
app.get("/api/applications", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      applications: data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.patch("/api/applications/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("applications")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      application: data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.patch("/api/applications/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("applications")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      application: data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─── Partner Application Submission ──────────────────────────────────────────
app.post("/api/apply", async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      linkedin,
      agency_name,
      website,
      years_exp,
      shopify_clients,
      message,
    } = req.body;

    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          full_name,
          email,
          phone,
          linkedin,
          agency_name,
          website,
          years_exp,
          shopify_clients,
          message,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.log("Supabase Error (apply):", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });

  } catch (err) {
    console.log("Server Error (apply):", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const { count: totalPartners } = await supabase
      .from("partners")
      .select("*", { count: "exact", head: true });

    const { count: pendingApplications } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { data: deals } = await supabase
      .from("deals")
      .select("id, stage, commission_amount, brand_name, created_at, partner_id");

    const activeDeals = deals?.length || 0;

    let totalRevenue = 0;
    let pendingPayouts = 0;

    (deals || []).forEach((deal) => {
      const amount = Number(deal.commission_amount) || 0;
      if (deal.stage === 5 || deal.stage === "Won") {
        totalRevenue += amount;
      } else {
        pendingPayouts += amount;
      }
    });

    const { data: partners } = await supabase
      .from("partners")
      .select("id, agency_name, tier, commission_rate");
      if (!partners) {
      console.log("Partners query failed");
    }

    const partnerMap = {};
    (partners || []).forEach((p) => {
      partnerMap[p.id] = {
        name: p.agency_name || "Unknown",
        agency:"Agency",
        tier: p.tier || "Silver",
        rate: p.commission_rate || 10,
        revenue: 0,
        commission: 0,
        dealCount: 0,
      };
    });

  (deals || []).forEach((deal) => {

    if (deal.stage !== "Won") return;

    const pid = deal.partner_id;
    if (!partnerMap[pid]) return;

    const amount = Number(deal.commission_amount) || 0;

    partnerMap[pid].revenue += amount;
    partnerMap[pid].commission += amount;
    partnerMap[pid].dealCount += 1;

});

    const topPartners = Object.values(partnerMap)
      .filter((p) => p.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)
      .map((p) => ({
        name: p.name,
        agency: p.agency,
        revenue: Math.round(p.revenue),
        commission: Math.round(p.commission),
        tier: p.tier,
      }));

    const STAGE_CONFIG = [
      { stage: "Contacted", key: 1, color: "#94a3b8" },
      { stage: "Demo Scheduled", key: 2, color: "#f59e0b" },
      { stage: "Demo Done", key: 3, color: "#3b82f6" },
      { stage: "Negotiating", key: 4, color: "#8b5cf6" },
      { stage: "Won", key: 5, color: "#10b981" },
    ];

    const STAGE_LABEL_MAP = {
      Contacted: 1,
      "Demo scheduled": 2,
      "Demo Scheduled": 2,
      "Demo done": 3,
      "Demo Done": 3,
      Negotiating: 4,
      Won: 5,
    };

    const stageToNum = (s) => {
      if (typeof s === "number") return s;
      return STAGE_LABEL_MAP[s] || 1;
    };

    const pipelineBuckets = {};
    STAGE_CONFIG.forEach((s) => {
      pipelineBuckets[s.key] = { count: 0, mrr: 0 };
    });

    (deals || []).forEach((deal) => {
      const key = stageToNum(deal.stage);
      if (!pipelineBuckets[key]) return;
      pipelineBuckets[key].count += 1;
      pipelineBuckets[key].mrr += Number(deal.commission_amount) || 0;
    });

    const pipeline = STAGE_CONFIG.map((s) => ({
      stage: s.stage,
      count: pipelineBuckets[s.key].count,
      mrr: pipelineBuckets[s.key].mrr,
      color: s.color,
    }));

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stalledDeals = (deals || []).filter((d) => {
      const stageNum = stageToNum(d.stage);
      if (stageNum === 5) return false;
      const created = new Date(d.created_at);
      return created < sevenDaysAgo;
    });

    const demoStageDeals = (deals || []).filter((d) => {
      const stageNum = stageToNum(d.stage);
      return stageNum === 2;
    });

    const attention = [];

    if (pendingApplications > 0) {
      attention.push({
        type: "application",
        icon: "📋",
        text: `${pendingApplications} pending application${pendingApplications !== 1 ? "s" : ""}`,
        sub: "Review and approve new partner applications",
        page: "applications",
        color: "#f59e0b",
      });
    }

    if (pendingPayouts > 0) {
      attention.push({
        type: "payout",
        icon: "💰",
        text: "Payouts due soon",
        sub: `₹${Math.round(pendingPayouts).toLocaleString()} pending across partners`,
        page: "payouts",
        color: "#ef4444",
      });
    }

    if (demoStageDeals.length > 0) {
      attention.push({
        type: "demo",
        icon: "📅",
        text: `${demoStageDeals.length} demo${demoStageDeals.length !== 1 ? "s" : ""} scheduled`,
        sub: demoStageDeals.slice(0, 2).map((d) => d.brand_name).join(", ") + (demoStageDeals.length > 2 ? ` +${demoStageDeals.length - 2} more` : ""),
        page: "deals",
        color: "#3b82f6",
      });
    }

    if (stalledDeals.length > 0) {
      attention.push({
        type: "stalled",
        icon: "⚠️",
        text: `${stalledDeals.length} stalled deal${stalledDeals.length !== 1 ? "s" : ""} (7+ days)`,
        sub: stalledDeals.slice(0, 2).map((d) => d.brand_name).join(", ") + (stalledDeals.length > 2 ? ` +${stalledDeals.length - 2} more` : ""),
        page: "deals",
        color: "#ef4444",
      });
    }

    res.json({
      success: true,
      stats: {
        totalPartners,
        pendingApplications,
        activeDeals,
        totalRevenue,
        pendingPayouts,
      },
      topPartners,
      pipeline,
      attention,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─── Admin Partners ─────────────────────────────────────────────

app.get("/api/admin/partners", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      partners: data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/api/admin/partners", async (req, res) => {
  try {
    const { full_name, email, agency_name } = req.body;

    if (!full_name || !email || !agency_name) {
      return res.status(400).json({
        success: false,
        message: "full_name, email, and agency_name are required",
      });
    }

    const { data, error } = await supabase
      .from("partners")
      .insert([
        {
          full_name,
          email,
          agency_name,
        },
      ])
      .select()
      .single();

    if (error) {
      console.log("Supabase Error (add partner):", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Partner added successfully",
      partner: data,
    });

  } catch (err) {
    console.log("Server Error (add partner):", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.patch("/api/admin/partners/:id/tier", async (req, res) => {
  try {

    const { id } = req.params;
    const { tier } = req.body;

    const { data, error } = await supabase
      .from("partners")
      .update({ tier })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      partner: data,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

app.patch("/api/admin/partners/:id/status", async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from("partners")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      partner: data,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

app.get("/api/admin/deals", async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("deals")
      .select(`
        *,
        partners(
          agency_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const deals = data.map((deal) => ({
      ...deal,
      partner_name: deal.partners?.agency_name || "Unknown",
    }));

    res.json({
      success: true,
      deals,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

app.patch("/api/admin/deals/:id/stage", async (req, res) => {
  try {

    const { id } = req.params;
    const { stage } = req.body;

    const { data: deal, error } = await supabase
      .from("deals")
      .update({ stage })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (stage === "Won") {

      const { data: existing } = await supabase
        .from("commissions")
        .select("id")
        .eq("deal_id", deal.id)
        .maybeSingle();

      if (!existing) {

        const { error: commissionError } = await supabase
          .from("commissions")
          .insert({
            partner_id: deal.partner_id,
            deal_id: deal.id,
            amount: deal.commission_amount || 0,
            status: "Pending",
          });

        if (commissionError) throw commissionError;
      }
    }

    res.json({
      success: true,
      deal,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─── Admin Payouts ────────────────────────────────────────────────────────────

app.get("/api/admin/payouts", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("commissions")
      .select(`
        id,
        amount,
        status,
        deal_id,
        partner_id,
        partners(
          id,
          agency_name,
          commission_rate
        )
      `)
      .eq("status", "Pending");

    if (error) throw error;

    const partnerMap = {};

    (data || []).forEach((row) => {
      const p = row.partners;
      if (!p) return;
      const pid = p.id;
      if (!partnerMap[pid]) {
        partnerMap[pid] = {
          id: pid,
          name: p.agency_name || "Unknown",
          rate: `${p.commission_rate || 10}%`,
          apps: 0,
          brands: [],
          amount: 0,
        };
      }
      partnerMap[pid].apps += 1;
      partnerMap[pid].amount += Number(row.amount) || 0;
    });

    const pending = Object.values(partnerMap).map((p) => ({
      ...p,
      amount: Math.round(p.amount),
    }));

    res.json({
      success: true,
      pending,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/api/admin/payouts/history", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("commissions")
      .select(`
        id,
        amount,
        status,
        payout_date,
        partner_id,
        partners(
          agency_name
        )
      `)
      .eq("status", "Paid")
      .order("payout_date", { ascending: false });

    if (error) throw error;

    const history = (data || []).map((row) => ({
      id: row.id,
      partner: row.partners?.agency_name || "Unknown",
      month: row.payout_date
        ? new Date(row.payout_date).toLocaleString("default", { month: "long", year: "numeric" })
        : "-",
      amount: Number(row.amount) || 0,
      status: "Paid",
      ref: "-",
    }));

    res.json({
      success: true,
      history,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/api/admin/payouts/mark-paid", async (req, res) => {
  try {
    const { partner_id } = req.body;

    if (!partner_id) {
      return res.status(400).json({ success: false, message: "partner_id is required" });
    }

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("commissions")
      .update({ status: "Paid", payout_date: today })
      .eq("partner_id", partner_id)
      .eq("status", "Pending");

    if (error) throw error;

    res.json({ success: true, message: "Payout marked as paid" });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/api/admin/payouts/mark-all-paid", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("commissions")
      .update({ status: "Paid", payout_date: today })
      .eq("status", "Pending");

    if (error) throw error;

    res.json({ success: true, message: "All payouts marked as paid" });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─── Commissions ──────────────────────────────────────────────────────────────
app.get("/api/commissions", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("deals")
      .select("brand_name, plan, commission_amount, stage, created_at");

    if (error) throw error;

    const STAGE_LABELS = ["Contacted", "Demo scheduled", "Demo done", "Negotiating", "Won"];
    const stageToNum = (s) => {
      if (typeof s === "number") return s;
      const i = STAGE_LABELS.indexOf(s);
      return i >= 0 ? i + 1 : 1;
    };

    let totalEarned = 0;
    let pendingPayout = 0;

    data.forEach((deal) => {
      const amount = parseFloat(deal.commission_amount) || 0;
      const isWon = stageToNum(deal.stage) === 5;
      if (isWon) {
        totalEarned += amount;
      } else {
        pendingPayout += amount;
      }
    });

    const avgPerDeal = data.length > 0
      ? (totalEarned + pendingPayout) / data.length
      : 0;

    const history = data.map((deal) => {
      const isWon = stageToNum(deal.stage) === 5;
      return {
        brand_name: deal.brand_name,
        plan: deal.plan,
        commission_amount: deal.commission_amount,
        stage: deal.stage,
        created_at: deal.created_at,
        status: isWon ? "Paid" : "Pending",
      };
    });

    res.json({
      totalEarned,
      pendingPayout,
      avgPerDeal,
      history,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
//
// FIXED:
//  - Returns 500 immediately (with a clear message) if the Supabase client
//    never initialized, instead of throwing a confusing TypeError later.
//  - Logs the *actual* Supabase error object (not just err.message) so the
//    real cause (bad URL, bad key, RLS blocking the query, missing table,
//    etc.) shows up in Render logs.
//  - Distinguishes "no row found" (expected, 401) from "query itself failed"
//    (unexpected, 500) by checking the Supabase error code.
//  - 400 for missing email/password, 401 for invalid credentials,
//    200 for success, 500 only for genuinely unexpected errors.
app.post("/api/auth/login", async (req, res) => {
  try {
    if (!requireSupabase(res)) return;

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .maybeSingle(); // returns null instead of throwing when no row matches

    if (error) {
      // This is a real Supabase/Postgres problem: bad table name, RLS policy
      // blocking the query, network issue, etc. Log full detail.
      console.error("Login Supabase Error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    if (!data) {
      // Query succeeded, just no matching partner — wrong email/password.
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      partner: {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        agency_name: data.agency_name,
        phone: data.phone,
        website: data.website,
        tier: data.tier,
        commission_rate: data.commission_rate,
        role: data.role,
      },
    });

  } catch (err) {
    // Genuinely unexpected exception (e.g. malformed request, code bug).
    console.error("Login Error (unexpected exception):", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// ─── Notifications ────────────────────────────────────────────────────────────
app.get("/api/notifications", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("id, created_at, action, description, partner_id")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    const notifications = (data || []).map((row) => ({
      id: row.id,
      text: row.description || row.action || "Activity logged",
      created_at: row.created_at,
      partner_id: row.partner_id,
    }));

    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Resources ────────────────────────────────────────────────────────────────
app.get("/api/resources", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const resources = data.map((r) => ({
      ...r,
      type: r.file_type || r.type || "DOC",
    }));

    res.json({
      success: true,
      resources,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─── Send Email ───────────────────────────────────────────────────────────────
app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    console.log("EMAIL REQUEST:", req.body);

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "to, subject, and message are required",
      });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html: `
        <div style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#0f172a;">
          ${message.replace(/\n/g, "<br/>")}
          
          <br/><br/>
          
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0" />

          <p style="font-size:12px;color:#64748b;">
            Sent via MobiDrag Partner Portal
          </p>
        </div>
      `,
    });

    console.log("RESEND DATA:", data);
    console.log("RESEND ERROR:", error);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }

    return res.json({
      success: true,
      message: "Email sent successfully",
      id: data?.id || null,
    });

  } catch (err) {
    console.log("CATCH ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─── Profile Update ───────────────────────────────────────────────────────────
app.post("/api/profile/update", async (req, res) => {
  try {
    const { id, full_name, agency_name, phone, website } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }

    const { data, error } = await supabase
      .from("partners")
      .update({
        full_name,
        agency_name,
        phone,
        website,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Profile updated successfully",
      partner: data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─── Partner Agreement ────────────────────────────────────────────────────────
app.post("/api/partner/agreement", async (req, res) => {
  try {
    const { partner_id, signature } = req.body;

    if (!partner_id || !signature) {
      return res.status(400).json({
        success: false,
        message: "partner_id and signature are required",
      });
    }

    const { data, error } = await supabase
      .from("partners")
      .update({
        agreement_accepted: true,
        agreement_signature: signature,
        agreement_date: new Date().toISOString(),
      })
      .eq("id", partner_id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Agreement saved successfully.",
      partner: data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─── Server Startup ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});