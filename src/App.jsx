
import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

const PAGE_DETAILS = {
  dashboard: {
    eyebrow: "SECURITY OVERVIEW",
    title: "Dashboard",
    description:
      "Your command center for identifying and tracking suspicious activity."
  },
  analyzer: {
    eyebrow: "THREAT INTELLIGENCE",
    title: "Scam Analyzer",
    description:
      "Inspect suspicious messages and uncover potential warning signs."
  },
  history: {
    eyebrow: "INVESTIGATION RECORDS",
    title: "Report History",
    description:
      "Search, review, and manage your previously submitted reports."
  }
};

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString();
}

function riskClass(value) {
  return String(value || "unknown").toLowerCase();
}

function isHighRisk(report) {
  const risk = String(report.riskLevel || "").toUpperCase();
  return risk === "HIGH" || risk === "CRITICAL";
}

function getReportCount(isLoading, hasError, count) {
  if (isLoading) return "...";
  if (hasError) return "!";
  return count;
}

function Sidebar({ activeMenu, navigateTo }) {
  const menuItems = [
    { id: "dashboard", icon: "▦", label: "Dashboard" },
    { id: "analyzer", icon: "⌕", label: "Scam Analyzer" },
    { id: "history", icon: "▤", label: "Report History" }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2.5 20 5.5v6c0 5-3.5 8.5-8 10.5-4.5-2-8-5.5-8-10.5v-6l8-3Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="m8.5 12 2.3 2.3 4.8-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="brand-copy">
          <h2>ScamShield</h2>
          <span className="brand-caption">SECURITY PLATFORM</span>
        </div>
      </div>

      <div className="sidebar-divider" />
      <p className="menu-title">WORKSPACE</p>

      <nav className="navigation" aria-label="Main navigation">
        {menuItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`menu-item ${activeMenu === item.id ? "active" : ""}`}
            onClick={() => navigateTo(item.id)}
            aria-current={activeMenu === item.id ? "page" : undefined}
            title={item.label}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="nav-label">{item.label}</span>
            {activeMenu === item.id && (
              <span className="active-indicator" />
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-status">
          <span className="status-dot" />
          <span>Detection Engine</span>
          <span className="online-label">READY</span>
        </div>
        <p>Rule-based message analysis</p>
        <div className="sidebar-version">
          <span>SCAMSHIELD</span>
          <span>SECURITY CENTER</span>
        </div>
      </div>
    </aside>
  );
}

function PageHeader({ activeMenu }) {
  const details = PAGE_DETAILS[activeMenu];

  return (
    <header className="topbar">
      <div className="page-heading">
        <p className="eyebrow">{details.eyebrow}</p>
        <h1>{details.title}</h1>
        <p className="subtitle">{details.description}</p>
      </div>

      <div className="topbar-right">
        <div className="system-status">
          <span className="status-dot" />
          <span>System Ready</span>
        </div>
        <div className="profile-mark" aria-label="ScamShield profile">
          SS
        </div>
      </div>
    </header>
  );
}

function StatCard({ icon, iconClass, tag, label, value, note, noteClass }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${iconClass}`} aria-hidden="true">
          {icon}
        </div>
        <span className="stat-tag">{tag}</span>
      </div>
      <p className="stat-label">{label}</p>
      <h3>{value}</h3>
      <p className="stat-description">
        <span className={noteClass} />
        <span>{note}</span>
      </p>
    </article>
  );
}

function Dashboard({
  totalReports,
  highRiskAlerts,
  pendingReviews,
  reportError,
  navigateTo
}) {
  return (
    <>
      <section className="welcome-banner">
        <div className="banner-content">
          <div className="banner-label">
            <span className="banner-label-dot" />
            <span>YOUR DIGITAL SAFETY, SIMPLIFIED</span>
          </div>

          <h2>
            Stay ahead of
            <br />
            <span>digital threats.</span>
          </h2>

          <p>
            Analyze suspicious messages, identify common scam indicators,
            and keep track of reports in one place.
          </p>

          <button
            type="button"
            className="primary-button banner-button"
            onClick={() => navigateTo("analyzer")}
          >
            <span>Start message analysis</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="banner-visual" aria-hidden="true">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="visual-shield">
            <svg viewBox="0 0 100 110" fill="none">
              <path
                d="M50 5 88 19v28c0 25-16 44-38 56C28 91 12 72 12 47V19L50 5Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="m34 52 11 11 22-24"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="visual-chip chip-top">
            <span className="chip-check">✓</span>
            <span>Threat monitoring</span>
          </div>

          <div className="visual-chip chip-bottom">
            <span className="status-dot" />
            <span>Analysis ready</span>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">AT A GLANCE</p>
            <h2 className="section-title">Security overview</h2>
          </div>
          <span className="updated-label">Live report totals</span>
        </div>

        <div className="stats-grid">
          <StatCard
            icon="▤"
            iconClass="icon-blue"
            tag="ALL RECORDS"
            label="Total reports"
            value={totalReports}
            note="All submitted reports"
            noteClass="stat-blue-dot"
          />
          <StatCard
            icon="⚠"
            iconClass="icon-red"
            tag="HIGH PRIORITY"
            label="High-risk alerts"
            value={highRiskAlerts}
            note="High and critical risk"
            noteClass="risk-dot"
          />
          <StatCard
            icon="◷"
            iconClass="icon-amber"
            tag="ACTION NEEDED"
            label="Pending reviews"
            value={pendingReviews}
            note="Awaiting review"
            noteClass="pending-dot"
          />
        </div>
      </section>

      {reportError && <Alert type="error" message={reportError} />}

      <section className="tools-section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">QUICK ACCESS</p>
            <h2 className="section-title">Your security tools</h2>
          </div>
        </div>

        <div className="tools-grid">
          <ToolCard
            icon="⌕"
            kicker="01 / ANALYSIS"
            title="Scam Analyzer"
            description="Examine a suspicious message and review the risk score and warning signs returned by the detection engine."
            action="Analyze a message"
            onClick={() => navigateTo("analyzer")}
          />
          <ToolCard
            icon="▤"
            kicker="02 / MANAGEMENT"
            title="Report History"
            description="Search saved reports, inspect their risk categories, and update review statuses."
            action="Manage reports"
            onClick={() => navigateTo("history")}
          />
        </div>
      </section>
    </>
  );
}

function ToolCard({ icon, kicker, title, description, action, onClick }) {
  return (
    <article className="tool-card">
      <div className="tool-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="tool-card-content">
        <span className="tool-kicker">{kicker}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <button type="button" className="text-button" onClick={onClick}>
          <span>{action}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

function Alert({ type, message }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`alert ${isSuccess ? "alert-success" : "alert-error"}`}
      role={isSuccess ? undefined : "alert"}
    >
      <span aria-hidden="true">{isSuccess ? "✓" : "!"}</span>
      <span>{message}</span>
    </div>
  );
}

function Analyzer({
  message,
  setMessage,
  analysis,
  analyzing,
  savingReport,
  analysisError,
  analyzeMessage,
  analyzeAndReport
}) {
  return (
    <div className="workspace-grid" id="scam-analyzer">
      <section className="panel analyzer-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">MESSAGE INSPECTION</p>
            <h2>Analyze a message</h2>
            <p>Submit text to check for common scam warning signs.</p>
          </div>
          <div className="panel-icon" aria-hidden="true">⌕</div>
        </div>

        <div className="notice-box">
          <span className="notice-icon" aria-hidden="true">i</span>
          <p>
            Avoid sharing real passwords, OTPs, banking details, or other
            sensitive personal information.
          </p>
        </div>

        <div className="field-heading">
          <label htmlFor="message">Message content</label>
          <span>TEXT INPUT</span>
        </div>

        <textarea
          id="message"
          className="message-input"
          placeholder={"Paste the suspicious SMS, email, or chat message here...\n\nExample: Your account will be blocked today. Click this link to verify your details."}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={5000}
        />

        <div className="input-meta">
          <span>{message.length}/5000 characters</span>
          <span>SMS · Email · Chat</span>
        </div>

        <div className="action-row">
          <button
            type="button"
            className="primary-button"
            onClick={analyzeMessage}
            disabled={!message.trim() || analyzing || savingReport}
          >
            {analyzing ? (
              <>
                <span className="button-spinner" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze message</span>
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={analyzeAndReport}
            disabled={!message.trim() || savingReport || analyzing}
          >
            {savingReport ? "Saving report..." : "Analyze & save report"}
          </button>
        </div>

        {analysisError && <Alert type="error" message={analysisError} />}

        <div className="panel-footnote">
          <span aria-hidden="true">⌁</span>
          <span>Results are based on the configured rule-based detector.</span>
        </div>
      </section>

      <AnalysisResults analysis={analysis} />
    </div>
  );
}

function AnalysisResults({ analysis }) {
  const reasons = Array.isArray(analysis?.reasons) ? analysis.reasons : [];

  return (
    <aside className="panel result-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">ASSESSMENT</p>
          <h2>Analysis results</h2>
        </div>
        <div className="result-status-dot" />
      </div>

      {!analysis && <EmptyResults />}

      {analysis && (
        <div className="result-content">
          <div className={`risk-summary risk-${riskClass(analysis.riskLevel)}`}>
            <span className="risk-summary-label">DETECTED RISK LEVEL</span>
            <h3>{analysis.riskLevel || "UNKNOWN"}</h3>
            <span className="risk-summary-note">
              Assessment returned by the detection engine
            </span>
          </div>

          <div className="result-metrics">
            <div className="result-metric">
              <span>Risk score</span>
              <strong>
                {analysis.score ?? "—"}<small>/100</small>
              </strong>
            </div>
            <div className="result-metric">
              <span>Category</span>
              <strong className="category-value">
                {analysis.category || "Unknown"}
              </strong>
            </div>
          </div>

          <div className="findings-heading">
            <h3>Detection reasons</h3>
            <span>{reasons.length} findings</span>
          </div>

          {reasons.length > 0 ? (
            <ul className="findings-list">
              {reasons.map((reason, index) => (
                <li key={`${reason}-${index}`}>
                  <span className="finding-marker">!</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-findings">
              No specific warning signs were returned.
            </p>
          )}
        </div>
      )}

      <div className="result-disclaimer">
        This assessment is an indicator, not a guarantee that a message
        is safe or fraudulent.
      </div>
    </aside>
  );
}

function EmptyResults() {
  return (
    <div className="empty-result">
      <div className="empty-result-icon">
        <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <circle
            cx="40"
            cy="40"
            r="31"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <path
            d="M40 18 59 25v14c0 13-8 22-19 28-11-6-19-15-19-28V25l19-7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M40 32v10m0 6h.01"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h3>Awaiting analysis</h3>
      <p>
        Your assessment will appear here after you submit a message
        for inspection.
      </p>

      <div className="empty-result-steps">
        <span>01</span>
        <p>Paste the message</p>
      </div>
      <div className="empty-result-steps">
        <span>02</span>
        <p>Run the analysis</p>
      </div>
      <div className="empty-result-steps">
        <span>03</span>
        <p>Review the findings</p>
      </div>
    </div>
  );
}

function ReportHistory({
  reports,
  loadingReports,
  reportError,
  statusMessage,
  searchTerm,
  setSearchTerm,
  refreshReports,
  updateReportStatus,
  deleteReport,
  navigateTo
}) {
  const search = searchTerm.toLowerCase();

  const filteredReports = reports.filter((report) => {
    return (
      String(report.content || "").toLowerCase().includes(search) ||
      String(report.category || "").toLowerCase().includes(search) ||
      String(report.id ?? "").toLowerCase().includes(search)
    );
  });

  return (
    <section className="panel history-panel">
      <div className="history-heading">
        <div>
          <p className="eyebrow">SAVED RECORDS</p>
          <h2>Report management</h2>
          <p>Review reports and keep their statuses up to date.</p>
        </div>

        <button
          type="button"
          className="secondary-button refresh-button"
          onClick={refreshReports}
          disabled={loadingReports}
        >
          <span aria-hidden="true">↻</span>
          <span>{loadingReports ? "Refreshing..." : "Refresh records"}</span>
        </button>
      </div>

      {statusMessage && <Alert type="success" message={statusMessage} />}
      {reportError && <Alert type="error" message={reportError} />}

      <div className="history-toolbar">
        <div className="history-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="text"
            placeholder="Search messages, categories, or IDs..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search reports by message, category, or ID"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <span className="record-count">
          {filteredReports.length} record
          {filteredReports.length === 1 ? "" : "s"}
        </span>
      </div>

      {loadingReports && (
        <output className="table-state" aria-live="polite">
          <span className="button-spinner" />
          <span>Loading reports...</span>
        </output>
      )}

      {!loadingReports && !reportError && reports.length === 0 && (
        <div className="table-state">
          <div className="table-state-icon">▤</div>
          <h3>No reports yet</h3>
          <p>Analyze and save a message to create your first report.</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigateTo("analyzer")}
          >
            <span>Open analyzer</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {!loadingReports && !reportError &&
        reports.length > 0 && filteredReports.length === 0 && (
          <div className="table-state">
            <div className="table-state-icon">⌕</div>
            <h3>No matching reports</h3>
            <p>Try a different search term.</p>
          </div>
        )}

      {!loadingReports && !reportError && filteredReports.length > 0 && (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>REPORT</th>
                <th>MESSAGE</th>
                <th>CATEGORY</th>
                <th>RISK LEVEL</th>
                <th>STATUS</th>
                <th>DATE CREATED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <span className="report-id">#{report.id}</span>
                  </td>
                  <td>
                    <div className="message-cell">
                      {report.content || "No message content"}
                    </div>
                  </td>
                  <td>
                    <span className="category-label">
                      {report.category || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <span className={`risk-badge ${riskClass(report.riskLevel)}`}>
                      <span className="badge-dot" />
                      <span>{report.riskLevel || "UNKNOWN"}</span>
                    </span>
                  </td>
                  <td>
                    <select
                      className={`status-select ${riskClass(report.status)}`}
                      value={report.status || "PENDING"}
                      onChange={(event) =>
                        updateReportStatus(report.id, event.target.value)
                      }
                      aria-label={`Update status for report ${report.id}`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWED">REVIEWED</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </td>
                  <td>
  <span className="date-cell">
    {formatDate(report.createdAt)}
  </span>
</td>
<td>
  <button
    type="button"
    className="delete-button"
    onClick={() => deleteReport(report.id)}
    disabled={loadingReports}
  >
    Delete
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="history-footer">
        <span>SCAMSHIELD · REPORT CENTER</span>
        <span>Keep your review statuses up to date.</span>
      </div>
    </section>
  );
}

function App() {
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState([]);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [savingReport, setSavingReport] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportError, setReportError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  async function loadReports() {
    setLoadingReports(true);

    try {
      const response = await api.get("/reports");
      setReports(response.data);
      setReportError("");
    } catch {
      setReportError(
        "Could not load reports. Check whether the backend is running."
      );
    } finally {
      setLoadingReports(false);
    }
  }

  useEffect(() => {
    void loadReports();
  }, []);

  function navigateTo(menu) {
    setActiveMenu(menu);

    if (menu !== "analyzer") {
      setAnalysisError("");
    }

    if (menu === "analyzer") {
      window.setTimeout(() => {
        document.getElementById("scam-analyzer")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 0);
    }
  }

  async function updateReportStatus(id, status) {
    setStatusMessage("");
    setReportError("");

    try {
      await api.patch(`/reports/${id}/status`, { status });
      const response = await api.get("/reports");
      setReports(response.data);
      setStatusMessage("Report status updated successfully.");
    } catch (error) {
      setReportError(
        error.response?.data?.message ||
          "Could not update report status. Please try again."
      );
    }
  }
  async function deleteReport(id) {
  const confirmed = window.confirm(
    `Are you sure you want to delete report #${id}? This action cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  setStatusMessage("");
  setReportError("");

  try {
    await api.delete(`/reports/${id}`);

    setReports((previousReports) =>
      previousReports.filter((report) => report.id !== id)
    );

    setStatusMessage(`Report #${id} deleted successfully.`);
  } catch (error) {
    setReportError(
      error.response?.data?.message ||
        "Could not delete the report. Please try again."
    );
  }
}

  async function refreshReports() {
    await loadReports();
  }

  async function analyzeMessage() {
    if (!message.trim()) {
      setAnalysisError("Please enter a message to analyze.");
      return;
    }

    setAnalyzing(true);
    setAnalysisError("");
    setAnalysis(null);

    try {
      const response = await api.post("/analyze", {
  content: message
});

console.log("Analyze API response:", response.data);

setAnalysis(response.data.analysis || response.data);
    } catch (error) {
      setAnalysisError(
        error.response?.data?.message ||
          "Analysis failed. Please check whether the backend is running."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  async function analyzeAndReport() {
    if (!message.trim()) {
      setAnalysisError("Please enter a message to analyze.");
      return;
    }

    setSavingReport(true);
    setAnalysisError("");
    setAnalysis(null);

    try {
      const response = await api.post("/analyze/report", {
        content: message
      });

      setAnalysis(response.data.analysis);

      const reportsResponse = await api.get("/reports");
      setReports(reportsResponse.data);
      setReportError("");
    } catch {
      setAnalysisError(
        "The analysis or report refresh failed. Please check the backend and try again."
      );
    } finally {
      setSavingReport(false);
    }
  }

  const totalReports = getReportCount(
    loadingReports,
    Boolean(reportError),
    reports.length
  );

  const highRiskAlerts = getReportCount(
    loadingReports,
    Boolean(reportError),
    reports.filter(isHighRisk).length
  );

  const pendingReviews = getReportCount(
    loadingReports,
    Boolean(reportError),
    reports.filter(
      (report) => report.status === "PENDING"
    ).length
  );

  return (
    <div className="app">
      <Sidebar activeMenu={activeMenu} navigateTo={navigateTo} />

      <main className="main-content">
        <PageHeader activeMenu={activeMenu} />

        {activeMenu === "dashboard" && (
          <Dashboard
            totalReports={totalReports}
            highRiskAlerts={highRiskAlerts}
            pendingReviews={pendingReviews}
            reportError={reportError}
            navigateTo={navigateTo}
          />
        )}

        {activeMenu === "analyzer" && (
          <Analyzer
            message={message}
            setMessage={setMessage}
            analysis={analysis}
            analyzing={analyzing}
            savingReport={savingReport}
            analysisError={analysisError}
            analyzeMessage={analyzeMessage}
            analyzeAndReport={analyzeAndReport}
          />
        )}

        {activeMenu === "history" && (
          <ReportHistory
            reports={reports}
            loadingReports={loadingReports}
            reportError={reportError}
            statusMessage={statusMessage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            refreshReports={refreshReports}
            updateReportStatus={updateReportStatus}
            deleteReport={deleteReport}
            navigateTo={navigateTo}
          />
        )}

        <footer className="app-footer">
          <span>ScamShield</span>
          <span className="footer-separator">·</span>
          <span>Rule-Based Scam Detection and Reporting System</span>
          <span className="footer-right">SECURITY CENTER</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
