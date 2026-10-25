import React, { useEffect, useState } from 'react';
import { getItems, createItem } from './services/api.js';

const categories = [
  'All Categories',
  'Electronics',
  'Accessories',
  'Books & Notes',
  'ID Cards',
  'Clothing',
  'Keys',
  'Bags',
  'Other',
];

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('All Categories');
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadItems() {
    setLoading(true);

    try {
      const result = await getItems({
        search,
        type: filter,
      });

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.items)
          ? result.items
          : Array.isArray(result?.data)
            ? result.data
            : [];

      setItems(list);
    } catch (error) {
      console.error('Could not load reports:', error);
      setItems([]);
      setNotice(
        'Could not connect to the server. Please check that the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, [search, filter]);

  async function submitReport(event) {
    event.preventDefault();

    if (submitting) return;

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    setSubmitting(true);
    setNotice('');

    try {
      await createItem(payload);

      setModal(false);
      form.reset();
      setSearch('');
      setFilter('all');
      setCategory('All Categories');
      setNotice('Your report has been submitted successfully!');

      await loadItems();
    } catch (error) {
      console.error('Report submission failed:', error);
      setNotice(
        error.message ||
          'Could not submit your report. Please check your server connection.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  const visibleItems = items.filter((item) => {
    const matchesCategory =
      category === 'All Categories' || item.category === category;

    const text = [
      item.title,
      item.location,
      item.description,
      item.category,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = text.includes(search.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

    return (
    <div className="app">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #f7f8fc;
          color: #182235;
        }
        

        button, input, select, textarea { font: inherit; }
        button { cursor: pointer; }

        .app { min-height: 100vh; }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 18px 7%;
          background: white;
          border-bottom: 1px solid #e9edf4;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #182235;
          font-size: 21px;
          font-weight: 800;
          text-decoration: none;
        }

        .brand-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #4f46e5;
          color: white;
          font-size: 23px;
        }

        .nav-note { color: #64748b; font-size: 14px; }

        .hero {
          padding: 76px 7% 68px;
          background: linear-gradient(130deg, #eef2ff, #f8faff 65%, #e0f2fe);
        }

        .hero-inner { max-width: 1120px; margin: auto; }

        .eyebrow {
          color: #4f46e5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 720px;
          margin: 18px 0;
          font-size: clamp(36px, 5vw, 60px);
          line-height: 1.1;
          letter-spacing: -2px;
        }

        .hero h1 span { color: #4f46e5; }

        .hero p {
          max-width: 600px;
          color: #64748b;
          font-size: 17px;
          line-height: 1.8;
        }

        .button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          border: 0;
          border-radius: 10px;
          padding: 13px 19px;
          font-weight: 700;
          transition: transform .15s, background .15s;
        }

        .button:hover { transform: translateY(-1px); }

        .button-primary { background: #4f46e5; color: white; }
        .button-primary:hover { background: #4338ca; }
        .button-outline {
          border: 1px solid #dbe1eb;
          background: white;
          color: #334155;
        }

        .main {
          max-width: 1120px;
          margin: auto;
          padding: 48px 24px 76px;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 26px;
        }

        .section-heading h2 { margin: 8px 0; font-size: 30px; }
        .muted { color: #64748b; line-height: 1.6; }

        .toolbar {
          display: grid;
          grid-template-columns: minmax(180px, 1fr) 190px;
          gap: 12px;
          margin-bottom: 20px;
        }

        .field, .toolbar input, .toolbar select {
          width: 100%;
          min-width: 0;
          border: 1px solid #dbe1eb;
          border-radius: 10px;
          background: white;
          padding: 12px 13px;
          color: #182235;
          outline: none;
        }

        .field:focus, .toolbar input:focus, .toolbar select:focus {
          border-color: #818cf8;
          box-shadow: 0 0 0 3px #4f46e51a;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin: 22px 0;
        }

        .filter-button {
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          background: white;
          color: #64748b;
          padding: 9px 17px;
        }

        .filter-button.active {
          background: #4f46e5;
          border-color: #4f46e5;
          color: white;
        }

        .item-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .item-card {
          display: flex;
          flex-direction: column;
          gap: 13px;
          min-width: 0;
          padding: 22px;
          border: 1px solid #e8ebf2;
          border-radius: 16px;
          background: white;
          box-shadow: 0 5px 20px #0f172a05;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .badge {
          display: inline-block;
          border-radius: 999px;
          padding: 6px 10px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 12px;
          font-weight: 700;
        }

        .badge.found { background: #dcfce7; color: #166534; }
        .badge.lost { background: #fee2e2; color: #991b1b; }

        .item-card h3 { margin: 0; font-size: 19px; overflow-wrap: anywhere; }
        .item-card p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .item-meta { color: #64748b; font-size: 13px; }
        .empty {
          padding: 52px 20px;
          border: 1px dashed #cbd5e1;
          border-radius: 16px;
          background: white;
          text-align: center;
        }

        .empty-icon { font-size: 38px; margin-bottom: 12px; }
        .empty h3 { margin: 8px 0; }
        .empty p { color: #64748b; line-height: 1.6; }

        .notice {
          margin-bottom: 20px;
          padding: 13px 16px;
          border: 1px solid #c7d2fe;
          border-radius: 10px;
          background: #eef2ff;
          color: #3730a3;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .modal-backdrop {
          position: fixed;
          z-index: 10;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #0f172a99;
          overflow-y: auto;
        }

        .report-modal {
          width: 100%;
          max-width: 620px;
          max-height: 92vh;
          overflow-y: auto;
          padding: 28px;
          border-radius: 18px;
          background: white;
          box-shadow: 0 20px 60px #0002;
        }

        .modal-heading {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .modal-heading h2 { margin: 9px 0; font-size: 28px; }
        .modal-heading p { margin: 0; color: #64748b; line-height: 1.6; }

        .close-button {
          border: 0;
          border-radius: 9px;
          background: #f1f5f9;
          padding: 8px 12px;
          color: #334155;
          font-size: 21px;
        }

        .report-form { display: grid; gap: 16px; }
        .report-form label {
          display: grid;
          gap: 8px;
          color: #334155;
          font-size: 14px;
          font-weight: 700;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .report-form textarea { resize: vertical; }
        .optional { color: #94a3b8; font-weight: 400; }

        .privacy-note {
          padding: 12px;
          border-radius: 10px;
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 5px;
        }

        .footer {
          padding: 25px 7%;
          border-top: 1px solid #e9edf4;
          background: white;
          color: #64748b;
          text-align: center;
          font-size: 13px;
        }

        @media (max-width: 800px) {
          .item-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .hero { padding-top: 55px; }
        }

        @media (max-width: 560px) {
          .navbar { padding: 14px 5%; }
          .nav-note { display: none; }
          .hero { padding: 48px 6%; }
          .hero h1 { letter-spacing: -1px; }
          .main { padding: 35px 16px 55px; }
          .toolbar, .item-grid, .form-row { grid-template-columns: 1fr; }
          .report-modal { padding: 21px; }
          .section-heading h2 { font-size: 26px; }
        }
            `}</style>

      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">⌕</span>
          <span>CampusFind</span>
        </a>
        <span className="nav-note">Your campus lost &amp; found community</span>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            setNotice('');
            setModal(true);
          }}
        >
          + Report an item
        </button>
      </header>

      <section className="hero" id="home">
        <div className="hero-inner">
          <div className="eyebrow">Lost something? Found something?</div>
          <h1>
            Lost it on campus?
            <br />
            <span>Let's find its way home.</span>
          </h1>
          <p>
            A simple place for your college community to report lost items,
            share found belongings, and help reunite people with the things
            that matter to them.
          </p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              setNotice('');
              setModal(true);
            }}
          >
            + Submit a report
          </button>
        </div>
      </section>

      <main className="main" id="reports">
        {notice && (
          <div className="notice" role="status">
            {notice}
            <button
              type="button"
              onClick={() => setNotice('')}
              style={{
                float: 'right',
                border: 0,
                background: 'transparent',
                color: 'inherit',
              }}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <div className="section-heading">
          <div>
            <div className="eyebrow">Campus community</div>
            <h2>Recent reports</h2>
            <div className="muted">
              Browse reports and help an item find its owner.
            </div>
          </div>
          <span className="muted">
            {visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="toolbar">
          <input
            type="search"
            aria-label="Search reports"
            placeholder="Search by item or location..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="filters" aria-label="Report type">
          {[
            ['all', 'All reports'],
            ['lost', 'Lost items'],
            ['found', 'Found items'],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={`filter-button ${filter === value ? 'active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty">
            <div className="empty-icon">⏳</div>
            <h3>Loading reports...</h3>
            <p>Please wait while we load campus reports.</p>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔎</div>
            <h3>No reports to display</h3>
            <p>
              There are no matching reports yet. You can submit a report to
              help your campus community.
            </p>
            <button
              type="button"
              className="button button-primary"
              onClick={() => {
                setNotice('');
                setModal(true);
              }}
            >
              Report an item
            </button>
          </div>
        ) : (
          <div className="item-grid">
            {visibleItems.map((item, index) => (
              <article
                className="item-card"
                key={item._id || item.id || `${item.title}-${index}`}
              >
                <div className="card-top">
                  <span
                    className={`badge ${
                      String(item.type).toLowerCase() === 'found'
                        ? 'found'
                        : 'lost'
                    }`}
                  >
                    {String(item.type || 'lost').toUpperCase()}
                  </span>
                  <span className="item-meta">{item.category}</span>
                </div>

                <h3>{item.title || 'Untitled item'}</h3>

                <p>
                  {item.description || 'No additional description provided.'}
                </p>

                <div className="item-meta">
                  📍 {item.location || 'Location not specified'}
                </div>

                <div className="item-meta">
                  📅 {item.date ? String(item.date).slice(0, 10) : 'Date not specified'}
                </div>

                {item.contact && (
                  <div className="item-meta">
                    Contact: {item.contact}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        CampusFind · College Lost and Found Portal
      </footer>

      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !submitting) {
              setModal(false);
            }
          }}
        >
          <section
            className="report-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-heading">
              <div>
                <div className="eyebrow">Help an item find its way</div>
                <h2 id="modal-title">Report an item</h2>
                <p>Share a few details with your campus community.</p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => !submitting && setModal(false)}
                aria-label="Close report form"
                disabled={submitting}
              >
                ×
              </button>
            </div>

            <form className="report-form" onSubmit={submitReport}>
              <label>
                What are you reporting?
                <select name="type" required defaultValue="lost">
                  <option value="lost">I lost something</option>
                  <option value="found">I found something</option>
                </select>
              </label>

              <label>
                Item name
                <input
                  name="title"
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="e.g. Blue water bottle"
                />
              </label>

              <div className="form-row">
                <label>
                  Category
                  <select name="category" required defaultValue="Accessories">
                    {categories.slice(1).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Date
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={getToday()}
                    max={getToday()}
                  />
                </label>
              </div>

              <label>
                Where was it lost or found?
                <input
                  name="location"
                  required
                  maxLength={150}
                  placeholder="e.g. Library, Block A"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  rows={3}
                  maxLength={1000}
                  placeholder="Colour, brand, distinguishing details..."
                />
              </label>

              <label>
                Contact information <span className="optional">(optional)</span>
                <input
                  name="contact"
                  type="text"
                  maxLength={150}
                  placeholder="College email or contact method"
                />
              </label>

              <div className="privacy-note">
                For your safety, don't include passwords, private ID numbers,
                or sensitive personal information in a report.
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="button button-outline"
                  disabled={submitting}
                  onClick={() => setModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit report'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
