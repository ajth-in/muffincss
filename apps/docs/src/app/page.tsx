
const Dashboard = () => {
  return (
    <div>
      {/* Nav Bar */}
      <nav className="nav-bar">
        <div className="menu-opener">
          <img src="./img/menu.svg" alt="menu" />
        </div>
        <div className="nav-content">
          <img src="./img/info-24px.svg" alt="i" />
          <img src="./img/notifications-24px.svg" alt="notification" />
          <img className="main-nav-icon" src="./img/icon.jpg" alt="main" />
        </div>
      </nav>

      {/* Side Menu */}
      <aside className="menu" id="menu">
        <div className="menu-header">
          <h1>Menu</h1>
          <button className="close-menu">
            <img src="./img/close.svg" alt="close-menu" />
          </button>
        </div>
        <div className="menu-links">
          <a href="#home" className="menu-link"><span>Home</span></a>
          <a href="#audience" className="menu-link"><span>Audience</span></a>
          <a href="#behavior" className="menu-link"><span>Behavior</span></a>
          <a href="#conversions" className="menu-link"><span>Conversions</span></a>
        </div>
      </aside>

      {/* Tab Selector */}
      <nav className="tab-selector">
        <div>
          <a href="#home" className="tab-select selected-tab">Home</a>
          <a href="#audience" className="tab-select">Audience</a>
          <a href="#behavior" className="tab-select">Behavior</a>
          <a href="#conversions" className="tab-select">Conversions</a>
        </div>
        <a href="#customize" className="tab-select float-right">Customize</a>
      </nav>

      <div className="main-layout">
        <main className="main">
          {/* Row 1 */}
          <div className="row-1">
            <div className="box active-users">
              <h2 className="box-title">Active Users</h2>
              <h1 className="number-fs">72</h1>
              <div className="box-footer">
                <a href="#referrals">
                  View Referrals
                  <img src="./img/arrow-right.svg" alt="arrow" />
                </a>
              </div>
            </div>
            <div className="box page-views">
              <h2 className="box-title">Page views per minute</h2>
              <div className="graph">
                {[66, 18, 34, 75, 15, 94, 95, 17, 32, 76, 80, 89, 63, 36, 82, 10, 27, 19, 5, 59, 18].map((height, index) => (
                  <div key={index} aria-label={`${height} page views`} style={{ height: `${height}%` }}></div>
                ))}
              </div>
              <div className="box-footer">
                <a href="#referrals">
                  View Referrals
                  <img src="./img/arrow-right.svg" alt="arrow" />
                </a>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="row-2">
            {[
              { title: 'Users', value: '15K', trend: '268%', color: 'green' },
              { title: 'Sessions', value: '17K', trend: '268%', color: 'green' },
              { title: 'Bounce Rate', value: '62.57%', trend: '19%', color: 'red' },
              { title: 'Session Duration', value: '1m 37s', trend: '29.7%', color: 'red' },
            ].map(({ title, value, trend, color }, i) => (
              <div className="stat-box" key={i}>
                <div className="stat-title">
                  <span>{title}</span>
                  <span className={`stat-percentage ${color}`}>
                    <img src={`./img/arrow-${color === 'green' ? 'up' : 'down'}-${color}.svg`} alt="" />{trend}
                  </span>
                </div>
                <h1 className="number-fs">{value}</h1>
              </div>
            ))}
          </div>

          {/* Row 3 */}
          <div className="row-3">
            <div className="alert">
              <div className="alert-title">
                <img src="./img/alert.svg" alt="alert" />
                <div>
                  <h2>No alerts set</h2>
                  <p>Get notified when your data drastically changes</p>
                </div>
              </div>
              <button className="alert-btn">Set alert</button>
            </div>
          </div>

          {/* Row 4 */}
          <div className="row-4">
            <div className="box device-box">
              <div className="box-title">Devices</div>
              <div className="select-months">
                {['May', 'June', 'July', 'August'].map((month, index) => (
                  <div className={`select-month ${index === 0 ? 'active' : ''}`} key={month}>{month}</div>
                ))}
              </div>
              <div className="month-info">
                {[
                  { label: 'Desktop', value: '52%', width: '62%' },
                  { label: 'Tablet', value: '15%', width: '25%' },
                  { label: 'Mobile', value: '36%', width: '46%' },
                ].map(({ label, value, width }, i) => (
                  <div className="month-info-box" key={i}>
                    {label} | {value}
                    <div className="month-bar" style={{ width }}></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="box device-box">
              <div className="box-title">References</div>
              <div className="reference-details">
                {[
                  ['Direct', 24],
                  ['Search', 18],
                  ['Github', 12],
                  ['Discord', 8],
                  ['Other', 2],
                ].map(([source, value], i) => (
                  <div className="reference" key={i}>
                    <span>{source}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Side Bar */}
        <aside className="side-bar">
          <div className="side-bar-header">
            <h3>Top Pages</h3>
            <h3>Visits</h3>
          </div>
          <div className="side-bar-content">
            {[
              ['/', '23,956'],
              ['/about', '5664'],
              ['/license', '2405'],
              ['/post/sketch-help-center-links-search-day-1120', '1203'],
              ['/post/sketch-stats-pricing-card-day-1116', '956'],
              ['/posts/sketch-dark-progress-bar-day-1112', '869'],
              ['/posts/sketch-message-ui-kit-day-5951', '654'],
            ].map(([page, visits], i) => (
              <div className="side-bar-page" key={i}>
                <h4>{page}</h4>
                <span>{visits}</span>
              </div>
            ))}
            <div className="more-stats-box">
              <div className="more-stats-header">
                More Stats
                <img src="./img/more-stats.svg" alt="more" />
              </div>
              <div className="more-stats-body">
                <div className="more-stats">
                  More stats
                  <h1>42K</h1>
                </div>
                <div className="more-stats">
                  More stats
                  <h1>47.45%</h1>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
