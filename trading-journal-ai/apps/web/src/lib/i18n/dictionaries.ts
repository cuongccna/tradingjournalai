export const dictionaries = {
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      trades: "Trades", 
      analytics: "Analytics",
      ai: "AI Assistant",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
      register: "Register"
    },

    // Dashboard
    dashboard: {
      title: "Trading Dashboard",
      subtitle: "Overview of your trading performance",
      totalTrades: "Total Trades",
      openTrades: "Open Trades",
      closedTrades: "Closed Trades", 
      totalPnL: "Total P&L",
      winRate: "Win Rate",
      totalVolume: "Total Volume",
      averageWin: "Average Win",
      averageLoss: "Average Loss",
      profitFactor: "Profit Factor",
      maxDrawdown: "Max Drawdown",
      bestTrade: "Best Trade",
      worstTrade: "Worst Trade",
      recentTrades: "Recent Trades",
      pnlOverTime: "P&L Over Time",
      assetDistribution: "Asset Distribution",
      monthlyPerformance: "Monthly Performance",
      dailyPnl: "Daily P&L",
      cumulativePnl: "Cumulative P&L",
      dailyPnlAndCumulative: "Daily P&L and Cumulative Performance",
      pnlByAssetType: "P&L by Asset Type", 
      monthlyPnlAndTradeCount: "Monthly P&L and Trade Count",
      monthlyPnl: "Monthly P&L",
      tradesCount: "Trades Count",
      performanceMetrics: "Performance Metrics",
      tradingActivity: "Trading Activity",
      quickActions: "Quick Actions",
      getStarted: "Get started with your trading journal",
      viewAllTrades: "View All Trades",
      manageTradingHistory: "Manage your trading history",
      addNewTrade: "Add New Trade",
      recordLatestTrades: "Record your latest trades",
      advancedAnalytics: "Advanced Analytics",
      deepDivePerformance: "Deep dive into performance",
      welcomeTitle: "Welcome to Trading Journal AI!",
      welcomeSubtitle: "Start by adding your first trade to track performance",
      getStartedButton: "Add First Trade",
      noDataTitle: "No Trading Data",
      noDataSubtitle: "Add some trades to see analytics and insights",
      activePositions: "Active Positions",
      yourLatestTrades: "Your latest 4 trades",
      liveAnalysis: "Live Analysis",
      aiPoweredInsights: "AI-powered insights from your trading patterns",
      tradesAnalyzed: "trades analyzed",
      profitFactorBelowOne: "Profit Factor Below 1.0",
      highPriority: "High Priority",
      currentProfitFactor: "Current profit factor: 0.00. Review your strategy.",
      highWinRateDetected: "High Win Rate Detected",
      mediumPriority: "Medium Priority",
      lowPriority: "Low Priority", 
      winRateExcellent: "Win rate of 100.0% is excellent. Focus on position sizing.",
      viewDetailedAnalysis: "View Detailed Analysis",
      getTradingRecommendations: "Get Trading Recommendations",
      patternRecognition: "Pattern Recognition",
      noRecentTrades: "No recent trades found",
      startTradingToSee: "Start trading to see your activity here",
      status: "Status",
      aiAnalysisInProgress: "AI analysis in progress...",
      moreInsightsWillAppear: "More insights will appear as you trade more",
      aiTradingAssistant: "AI Trading Assistant"
    },

    // Trades
    trades: {
      title: "Trading Journal",
      subtitle: "Manage and track your trades",
      addTrade: "Add Trade",
      editTrade: "Edit Trade",
      deleteTrade: "Delete Trade",
      symbol: "Symbol",
      assetType: "Asset Type",
      side: "Side",
      quantity: "Quantity",
      entryPrice: "Entry Price",
      exitPrice: "Exit Price",
      entryDate: "Entry Date",
      exitDate: "Exit Date",
      pnl: "P&L",
      status: "Status",
      strategy: "Strategy",
      notes: "Notes",
      tags: "Tags",
      actions: "Actions",
      buy: "Buy",
      sell: "Sell",
      long: "Long",
      short: "Short",
      open: "Open",
      closed: "Closed",
      cancelled: "Cancelled",
      stock: "Stock",
      forex: "Forex",
      crypto: "Crypto",
      futures: "Futures",
      options: "Options",
      stocksEtfs: "Stocks & ETFs",
      cryptocurrency: "Cryptocurrency",
      commodities: "Commodities",
      otherAssets: "Other Assets",
      filtersSearch: "Filters & Search",
      searchPlaceholder: "Search trades by symbol, strategy, or tags...",
      allTrades: "All Trades",
      openPositions: "Open Positions",
      closedTrades: "Closed Trades",
      sortBy: "Sort By",
      date: "Date",
      newest: "Newest",
      oldest: "Oldest",
      highestPnl: "Highest P&L",
      lowestPnl: "Lowest P&L",
      totalPnl: "Total P&L",
      tradesCount: "trades",
      openCount: "open",
      entry: "Entry",
      exit: "Exit",
      noTradesFound: "No trades found",
      startByAdding: "Start by adding your first trade to track performance.",
      adjustCriteria: "Try adjusting your search or filter criteria.",
      addFirstTrade: "Add First Trade",
      sortByDate: "Sort by Date",
      sortBySymbol: "Sort by Symbol",
      sortByPnl: "Sort by P&L",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      deleteConfirmation: "This action cannot be undone.",
      confirmDelete: "Are you sure you want to delete this trade?",
      deleteConfirm: "Yes, delete it",
      deleteCancel: "Cancel",
      tradeDeletedSuccess: "Trade deleted successfully",
      failedToDeleteTrade: "Failed to delete trade",

      // Trade View Modal
      tradeDetails: "Trade Details",
      timeline: "Timeline",
      openPosition: "Open Position",
      profitLoss: "Profit & Loss",
      returnPercentage: "return",
      close: "Close",

      // Trade Edit Modal
      save: "Save",
      cancel: "Cancel",
      updateTrade: "Update Trade",
      tradeUpdatedSuccess: "Trade updated successfully",
      failedToUpdateTrade: "Failed to update trade",

      // Trade Entry Form
      addNewTrade: "Add New Trade",
      selectAssetType: "Select asset type",
      selectSide: "Select trade side",
      enterSymbol: "Enter symbol (e.g., AAPL, BTCUSD)",
      enterQuantity: "Enter quantity",
      enterPrice: "Enter price",
      selectDate: "Select date",
      selectStrategy: "Select strategy",
      enterNotes: "Enter notes (optional)",
      enterTags: "Enter tags (comma separated)",
      createTrade: "Create Trade",
      tradeCreatedSuccess: "Trade created successfully",
      failedToCreateTrade: "Failed to create trade",
      optional: "Optional",
      enterStrategy: "e.g., Swing Trading, Day Trading, Scalping",
      updating: "Updating",
      more: "more",

      // Form Steps
      assetTypeStep: "Asset Type",
      assetTypeStepDesc: "Select asset type and symbol",
      tradeDetailsStep: "Trade Details",
      tradeDetailsStepDesc: "Enter trade execution details",
      analysisNotesStep: "Analysis & Notes",
      analysisNotesStepDesc: "Add strategy and notes"
    },

    // AI Assistant
    ai: {
      title: "AI Trading Assistant",
      subtitle: "AI-powered analysis, insights, and market intelligence",
      aiSettings: "AI Settings",
      analysis: "AI Analysis",
      patterns: "Patterns",
      market: "Market",
      risk: "Risk",

      // AI Trade Analysis Component
      tradeAnalysisTitle: "AI Trade Analysis",
      liveData: "Live Data",
      refreshAnalysis: "Refresh Analysis",
      aiInsights: "AI Insights",
      tradeAnalysis: "Trade Analysis",
      aiScore: "AI Score",
      riskLevel: "Risk Level",
      prediction: "Prediction",
      aiReasoning: "AI Reasoning:",
      recommendations: "Recommendations:",
      confidence: "Confidence",
      viewFullAnalysis: "View Full Analysis",

      // Loading and error states
      loadingTradingData: "Loading your trading data...",
      aiAnalyzing: "AI is analyzing your trades...",
      noTradesFound: "No trades found. Add some trades to get AI insights!",
      errorLoadingData: "Error loading trade data:",
      retry: "Retry",
      updated: "Updated",

      // Dynamic text
      insightsFromTrades: "AI-powered insights from your {count} trades • Real-time analysis",

      // Insight Titles
      excellentWinRate: "Excellent Win Rate",
      profitFactorBelowOne: "Profit Factor Below 1.0",
      highWinRateStrategy: "High Win-Rate Strategy",
      unrealizedGains: "Significant Unrealized Gains",
      frequentLosses: "Frequent Small Losses",
      bestStrategy: "Best Strategy",
      highConcentrationRisk: "High Concentration Risk",
      winRateImprovement: "Win Rate Improvement Needed",
      strongProfitFactor: "Strong Profit Factor",

      // Insight Descriptions
      winRateDescription: "Your win rate is {winRate}%, which is above your target. Keep up the great work!",
      profitFactorDescription: "Your current profit factor is {profitFactor}. Review losing trades to identify patterns and improve profitability.",
      strategyDescription: "\"{strategy}\" shows {pnl} profit with {winRate}% win rate across {trades} trades.",
      unrealizedGainsDescription: "You have {pnl} in unrealized gains on {symbol}. Consider setting a trailing stop to protect profits.",
      frequentLossesDescription: "You have {count} small losses in a row. Review your risk management and entry criteria.",
      concentrationRiskDescription: "{percentage}% of trades in {asset}. Consider diversification to reduce portfolio risk.",
      winRateImprovementDescription: "{winRate}% win rate suggests room for improvement. Consider refining entry criteria.",
      strongProfitFactorDescription: "Profit factor of {profitFactor} indicates excellent risk-reward management.",

      // Trade Analysis Items
      standardMarketConditions: "Standard market conditions",
      largePositionPartialProfit: "Large position - consider partial profit taking",
      highRisk: "HIGH",
      mediumRisk: "MEDIUM",
      lowRisk: "LOW",

      // Buttons & Labels
      actionable: "Actionable",
      viewDetails: "View Details",

      // Trade Analysis Reasons
      tradeAnalysisReasons: {
        strategyHighWinRate: "Strategy \"{strategy}\" has {winRate}% win rate",
        strategyLowWinRate: "Strategy \"{strategy}\" has low {winRate}% win rate",
        tradeClosedProfitably: "Trade closed profitably",
        tradeClosedAtLoss: "Trade closed at loss",
        cryptoHighVolatility: "Crypto assets have high volatility",
        stockModerateRisk: "Stock trading with moderate risk",
        standardMarketConditions: "Standard market conditions"
      },

      // Trade Analysis Recommendations
      tradeAnalysisRecommendations: {
        monitorForPriceSwings: "Monitor closely for price swings",
        largePositionPartialProfit: "Large position - consider partial profit taking",
        setStopLoss: "Set stop loss at -5%",
        considerTakeProfit: "Consider taking profit at +10%",
        followTradingPlan: "Follow your trading plan"
      },

      // Pattern Recognition
      patternRecognition: "Pattern Recognition",
      realData: "Real Data",
      aiPoweredPatternDetection: "AI-powered pattern detection from your {count} trades",
      timeframe: "Timeframe",
      scanPatterns: "Scan Patterns",
      loadingPatternData: "Loading pattern data...",
      scanningPatterns: "Scanning for patterns...",
      detectedPatterns: "Detected Patterns ({count})",
      noSignificantPatterns: "No significant patterns detected",
      addMoreTradesAnalysis: "Add more trades for better analysis",
      winningStrategyPattern: "Winning Strategy Pattern",
      lossPatternAlert: "Loss Pattern Alert",
      patternConfidence: "confidence",
      success: "Success",
      target: "Target",
      stopLoss: "Stop Loss",
      patternPerformance: "Pattern Performance",
      winRate: "win rate",
      totalTrades: "Total Trades",
      successful: "Successful",
      avgReturn: "Avg Return",
      bestReturn: "Best Return",
      noPerformanceData: "No performance data available",

      // News
      news: {
        title: "News",
        filters: {
          all: "All",
          positive: "Positive",
          negative: "Negative",
          neutral: "Neutral"
        },
        impact: {
          high: "High Impact",
          medium: "Medium Impact",
          low: "Low Impact"
        },
        items: {
          techStocksRally: {
            title: "Tech Stocks Rally on Positive Earnings Reports",
            summary: "Major technology companies reported stronger than expected earnings, driving sector-wide gains."
          },
          fedRateCut: {
            title: "Federal Reserve Hints at Rate Cut",
            summary: "Fed officials suggest potential interest rate adjustments in upcoming meeting."
          },
          energyVolatility: {
            title: "Energy Sector Volatility Expected",
            summary: "Oil price fluctuations may impact energy stock performance this week."
          },
          cryptoVolatility: {
            title: "Cryptocurrency Market Shows Volatility",
            summary: "Bitcoin and major altcoins experience significant price movements amid regulatory concerns."
          }
        }
      },

      // Market Data Dashboard
      marketDataDashboard: {
        title: "Market Data Dashboard",
        subtitle: "Real-time market data and trading signals",
        lastUpdate: "Updated",
        refreshButton: "Refresh Data",
        loading: "Fetching market data...",
        portfolioAnalysis: {
          title: "Portfolio Analysis",
          positive: "positive",
          negative: "negative",
          neutral: "neutral",
          trades: "trades",
          winRate: "Win Rate",
          totalQuantity: "Total Quantity",
          avgPnL: "Avg P&L",
          tradeCount: "Trade Count",
          performance: "Performance"
        },
        recommendations: {
          title: "Trading Recommendations",
          confidence: "Confidence",
          high: "high",
          medium: "medium",
          low: "low"
        },
        alerts: {
          title: "Market Alerts & Notifications",
          highVolatility: {
            title: "High Volatility Alert",
            description: "TSLA showing unusual volume spikes. Consider adjusting position sizes."
          },
          momentumBreakout: {
            title: "Momentum Breakout",
            description: "NVDA breaking above resistance at $450. Strong bullish signal detected."
          },
          priceTarget: {
            title: "Price Target Reached",
            description: "AAPL reached your target price of $175. Consider taking profits."
          }
        }
      },

      // Risk Management
      riskManagement: {
        title: "Risk Management",
        subtitle: "Portfolio risk analysis and position sizing calculator",
        analyzeButton: "Analyze Risk",
        loading: "Calculating risk metrics...",
        riskParameters: {
          title: "Risk Parameters",
          portfolioValue: "Portfolio Value ($)",
          maxRiskPerTrade: "Max Risk per Trade (%)"
        },
        riskMetrics: {
          title: "Portfolio Risk Metrics",
          limit: "Limit",
          status: {
            safe: "Safe",
            warning: "Warning", 
            danger: "Danger"
          },
          valueAtRisk: {
            name: "Value at Risk",
            description: "Maximum expected loss over 1 day at 95% confidence",
            recommendation: "Consider diversifying if VAR exceeds 3% of portfolio"
          },
          sharpeRatio: {
            name: "Sharpe Ratio",
            description: "Risk-adjusted return measurement",
            recommendation: "Aim for Sharpe ratio above 1.0 for good risk-adjusted returns"
          },
          maxDrawdown: {
            name: "Maximum Drawdown",
            description: "Largest peak-to-trough decline in portfolio value",
            recommendation: "Keep drawdown below 20% through position sizing"
          }
        },
        positionSizing: {
          title: "Position Sizing Calculator",
          riskAmount: "Risk Amount per Trade",
          current: "Current Position",
          suggested: "Suggested Position", 
          maxPosition: "Max Position Size",
          entryPrice: "Entry Price",
          stopLoss: "Stop Loss",
          applyButton: "Apply Position"
        },
        riskScenarios: {
          title: "Risk Scenarios",
          chance: "chance",
          probability: "Probability",
          impact: "Impact",
          portfolioLoss: "Portfolio Loss",
          affectedPositions: "Affected Positions",
          mitigation: "Mitigation Strategies",
          marketCrash: {
            name: "Market Crash (20% decline)"
          },
          sectorDownturn: {
            name: "Sector-specific Downturn"
          },
          interestRateRise: {
            name: "Interest Rate Rise"
          },
          mitigationMeasures: {
            marketCrash: [
              "Diversify across asset classes",
              "Maintain cash reserves",
              "Use stop-loss orders"
            ],
            sectorDownturn: [
              "Diversify across sectors",
              "Monitor sector news",
              "Reduce position concentration"
            ],
            interestRateRise: [
              "Reduce duration risk",
              "Focus on rate-resistant sectors",
              "Consider inflation hedges"
            ]
          }
        }
      },

      // Chat & Messages
      messages: {
        initialMessage: "Hello! I'm your AI trading assistant. How can I help you analyze your trades today?",
        placeholder: "Ask me anything about your trades...",
        sendButton: "Send"
      },
      chat: "AI Chat",
      marketNews: "Market News & Analysis",
      portfolioAnalysis: "Portfolio Analysis",
      quickQuestions: "Quick Questions",
      analyzePerformance: "Analyze my recent performance",
      bestPatterns: "What are my best trading patterns?",
      diversifyPortfolio: "Should I diversify my portfolio?",
      improveWinRate: "How can I improve my win rate?",
      riskExposure: "What's my risk exposure?",
      positionSizing: "Suggest position sizing for AAPL",
      aiGreeting: "Hello! I'm your AI trading assistant. How can I help you analyze your trades today?"
    },

    // Analytics
    analytics: {
      title: "Trading Analytics",
      subtitle: "Comprehensive view of your trading performance",
      refreshData: "Refresh Data",
      loading: "Loading...",
      loadingAnalytics: "Loading analytics...",
      accessDenied: "Access Denied",
      pleaseLogin: "Please log in to access analytics",
      goToLogin: "Go to Login",

      // KPI Cards
      totalPnl: "Total P&L",
      winRate: "Win Rate",
      totalTrades: "Total Trades",
      profitFactor: "Profit Factor",
      trades: "trades",
      months: "months",
      profitable: "Profitable",
      unprofitable: "Unprofitable",

      // Performance Breakdown
      performanceBreakdown: "Performance Breakdown",
      averageWin: "Average Win",
      averageLoss: "Average Loss",
      bestTrade: "Best Trade",
      worstTrade: "Worst Trade",

      // Monthly Performance
      monthlyPerformance: "Monthly Performance",
      monthlyPnl: "Monthly P&L",

      // Charts
      pnlOverTime: "P&L Over Time",
      assetDistribution: "Asset Distribution",
      cumulativePnl: "Cumulative P&L",
      volume: "Volume",

      // Additional Metrics
      riskMetrics: "Risk Metrics",
      tradingHabits: "Trading Habits",
      volumeMetrics: "Volume Metrics",
      maxDrawdown: "Max Drawdown",
      totalVolume: "Total Volume",
      activePositions: "Active Positions",
      recentTrades: "Recent Trades",
      assetTypes: "Asset Types",
      avgTradeSize: "Average Trade Size",
      largestPosition: "Largest Position"
    },

    // Settings
    settings: {
      title: "Settings",
      subtitle: "Manage your account and preferences",
      profile: "Profile",
      preferences: "Preferences",
      security: "Security",
      notifications: "Notifications",
      language: "Language",
      timezone: "Timezone",
      currency: "Currency",
      theme: "Theme",
      english: "English",
      vietnamese: "Vietnamese",
      save: "Save Changes",
      cancel: "Cancel",
      saveSuccess: "Settings saved successfully",
      saveError: "Error saving settings"
    },

    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Info",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      ok: "OK",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      export: "Export",
      import: "Import",
      refresh: "Refresh",
      back: "Back",
      next: "Next",
      previous: "Previous",
      close: "Close",
      open: "Open",
      view: "View",
      accessDenied: "Access Denied",
      pleaseLogin: "Please log in to access the dashboard",
      welcome: "Welcome back",
      loadingAnalytics: "Loading analytics...",
      analyzingData: "Analyzing your trading data",
      tryAgain: "Try Again",
      details: "Details"
    },

    // Forms
    forms: {
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      displayName: "Display Name",
      fullName: "Full Name",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      address: "Address",
      city: "City",
      country: "Country",
      zipCode: "ZIP Code",
      required: "This field is required",
      invalidEmail: "Invalid email address",
      passwordTooShort: "Password must be at least 8 characters",
      passwordsNotMatch: "Passwords do not match",
      passwordMinLength: "Password must be at least 6 characters",
      invalidNumber: "Invalid number",
      invalidDate: "Invalid date",
      submit: "Submit",
      submitting: "Submitting...",
      loginButton: "Sign In",
      registerButton: "Sign Up",
      loginTitle: "Welcome back",
      loginSubtitle: "Sign in to your account",
      registerTitle: "Create Account",
      registerSubtitle: "Sign up for a new account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      signUp: "Sign up",
      signIn: "Sign in",
      forgotPassword: "Forgot password?",
      rememberMe: "Remember me",
      selectOption: "Select an option",
      enterValue: "Enter value",
      fullNamePlaceholder: "John Doe",
      emailPlaceholder: "john@example.com",
      passwordPlaceholder: "Enter your password",
      confirmPasswordPlaceholder: "Confirm your password",
      creatingAccount: "Creating account...",
      createAccount: "Create Account"
    }
  },

  vi: {
    // Navigation
    nav: {
      dashboard: "Bảng điều khiển",
      trades: "Giao dịch",
      analytics: "Phân tích",
      ai: "Trợ lý AI",
      settings: "Cài đặt",
      logout: "Đăng xuất",
      login: "Đăng nhập",
      register: "Đăng ký"
    },

    // Dashboard
    dashboard: {
      title: "Bảng điều khiển giao dịch",
      subtitle: "Tổng quan hiệu suất giao dịch của bạn",
      totalTrades: "Tổng giao dịch",
      openTrades: "Lệnh đang mở",
      closedTrades: "Lệnh đã đóng",
      totalPnL: "Tổng P&L",
      winRate: "Tỷ lệ thắng",
      totalVolume: "Tổng khối lượng",
      averageWin: "Lãi trung bình",
      averageLoss: "Lỗ trung bình",
      profitFactor: "Hệ số lợi nhuận",
      maxDrawdown: "Sụt giảm tối đa",
      bestTrade: "Lệnh tốt nhất",
      worstTrade: "Lệnh tệ nhất",
      recentTrades: "Giao dịch gần đây",
      pnlOverTime: "P&L theo thời gian",
      assetDistribution: "Phân bổ tài sản",
      monthlyPerformance: "Hiệu suất hàng tháng",
      dailyPnl: "P&L hàng ngày",
      cumulativePnl: "P&L tích lũy",
      dailyPnlAndCumulative: "P&L hàng ngày và hiệu suất tích lũy",
      pnlByAssetType: "P&L theo loại tài sản",
      monthlyPnlAndTradeCount: "P&L hàng tháng và số lượng giao dịch",
      monthlyPnl: "P&L hàng tháng",
      tradesCount: "Số lượng giao dịch",
      performanceMetrics: "Chỉ số hiệu suất",
      tradingActivity: "Hoạt động giao dịch",
      quickActions: "Hành động nhanh",
      getStarted: "Bắt đầu với nhật ký giao dịch của bạn",
      viewAllTrades: "Xem tất cả giao dịch",
      manageTradingHistory: "Quản lý lịch sử giao dịch",
      addNewTrade: "Thêm giao dịch mới",
      recordLatestTrades: "Ghi lại các giao dịch mới nhất",
      advancedAnalytics: "Phân tích nâng cao",
      deepDivePerformance: "Đi sâu vào hiệu suất",
      welcomeTitle: "Chào mừng đến với Trading Journal AI!",
      welcomeSubtitle: "Bắt đầu bằng cách thêm giao dịch đầu tiên để theo dõi hiệu suất",
      getStartedButton: "Thêm giao dịch đầu tiên",
      noDataTitle: "Không có dữ liệu giao dịch",
      noDataSubtitle: "Thêm một số giao dịch để xem phân tích và thông tin chi tiết",
      activePositions: "Vị thế đang hoạt động",
      yourLatestTrades: "4 giao dịch mới nhất của bạn",
      liveAnalysis: "Phân tích trực tiếp",
      aiPoweredInsights: "Thông tin chi tiết được hỗ trợ bởi AI từ các mô hình giao dịch của bạn",
      tradesAnalyzed: "giao dịch đã phân tích",
      profitFactorBelowOne: "Hệ số lợi nhuận dưới 1.0",
      highPriority: "Ưu tiên cao",
      currentProfitFactor: "Hệ số lợi nhuận hiện tại: 0.00. Xem xét lại chiến lược của bạn.",
      highWinRateDetected: "Phát hiện tỷ lệ thắng cao",
      mediumPriority: "Ưu tiên trung bình",
      lowPriority: "Ưu tiên thấp",
      winRateExcellent: "Tỷ lệ thắng 100.0% rất tuyệt vời. Tập trung vào kích thước vị thế.",
      viewDetailedAnalysis: "Xem phân tích chi tiết",
      getTradingRecommendations: "Nhận khuyến nghị giao dịch",
      patternRecognition: "Nhận dạng mẫu",
      noRecentTrades: "Không tìm thấy giao dịch gần đây",
      startTradingToSee: "Bắt đầu giao dịch để xem hoạt động của bạn tại đây",
      status: "Trạng thái",
      aiAnalysisInProgress: "Phân tích AI đang thực hiện...",
      moreInsightsWillAppear: "Nhiều thông tin chi tiết hơn sẽ xuất hiện khi bạn giao dịch nhiều hơn",
      aiTradingAssistant: "Trợ lý AI Trading"
    },

    // Trades
    trades: {
      title: "Nhật ký giao dịch",
      subtitle: "Quản lý và theo dõi giao dịch của bạn",
      addTrade: "Thêm giao dịch",
      editTrade: "Sửa giao dịch",
      deleteTrade: "Xóa giao dịch",
      symbol: "Mã",
      assetType: "Loại tài sản",
      side: "Hướng",
      quantity: "Số lượng",
      entryPrice: "Giá vào",
      exitPrice: "Giá ra",
      entryDate: "Ngày vào",
      exitDate: "Ngày ra",
      pnl: "P&L",
      status: "Trạng thái",
      strategy: "Chiến lược",
      notes: "Ghi chú",
      tags: "Thẻ",
      actions: "Thao tác",
      buy: "Mua",
      sell: "Bán",
      long: "Long",
      short: "Short",
      open: "Mở",
      closed: "Đóng",
      cancelled: "Hủy",
      stock: "Cổ phiếu",
      forex: "Ngoại hối",
      crypto: "Tiền mã hóa",
      futures: "Hợp đồng tương lai",
      options: "Quyền chọn",
      stocksEtfs: "Cổ phiếu & ETFs",
      cryptocurrency: "Tiền điện tử",
      commodities: "Hàng hóa",
      otherAssets: "Tài sản khác",
      filtersSearch: "Bộ lọc & Tìm kiếm",
      searchPlaceholder: "Tìm kiếm giao dịch theo mã, chiến lược hoặc thẻ...",
      allTrades: "Tất cả giao dịch",
      openPositions: "Vị thế đang mở",
      closedTrades: "Giao dịch đã đóng",
      sortBy: "Sắp xếp theo",
      date: "Ngày",
      newest: "Mới nhất",
      oldest: "Cũ nhất",
      highestPnl: "P&L cao nhất",
      lowestPnl: "P&L thấp nhất",
      totalPnl: "Tổng P&L",
      tradesCount: "giao dịch",
      openCount: "đang mở",
      entry: "Vào",
      exit: "Ra",
      noTradesFound: "Không tìm thấy giao dịch",
      startByAdding: "Bắt đầu bằng cách thêm giao dịch đầu tiên để theo dõi hiệu suất.",
      adjustCriteria: "Thử điều chỉnh tìm kiếm hoặc tiêu chí lọc.",
      addFirstTrade: "Thêm Giao Dịch Đầu Tiên",
      sortByDate: "Sắp xếp theo Ngày",
      sortBySymbol: "Sắp xếp theo Mã",
      sortByPnl: "Sắp xếp theo P&L",
      view: "Xem",
      edit: "Sửa",
      delete: "Xóa",
      deleteConfirmation: "Hành động này không thể hoàn tác.",
      confirmDelete: "Bạn có chắc chắn muốn xóa giao dịch này?",
      deleteConfirm: "Có, xóa nó",
      deleteCancel: "Hủy",
      tradeDeletedSuccess: "Đã xóa giao dịch thành công",
      failedToDeleteTrade: "Không thể xóa giao dịch",

      // Trade View Modal
      tradeDetails: "Chi tiết giao dịch",
      timeline: "Thời gian",
      openPosition: "Vị thế đang mở",
      profitLoss: "Lãi & Lỗ",
      returnPercentage: "lợi nhuận",
      close: "Đóng",

      // Trade Edit Modal
      save: "Lưu",
      cancel: "Hủy",
      updateTrade: "Cập nhật giao dịch",
      tradeUpdatedSuccess: "Đã cập nhật giao dịch thành công",
      failedToUpdateTrade: "Không thể cập nhật giao dịch",

      // Trade Entry Form
      addNewTrade: "Thêm giao dịch mới",
      selectAssetType: "Chọn loại tài sản",
      selectSide: "Chọn hướng giao dịch",
      enterSymbol: "Nhập mã (ví dụ: AAPL, BTCUSD)",
      enterQuantity: "Nhập số lượng",
      enterPrice: "Nhập giá",
      selectDate: "Chọn ngày",
      selectStrategy: "Chọn chiến lược",
      enterNotes: "Nhập ghi chú (tùy chọn)",
      enterTags: "Nhập thẻ (phân cách bằng dấu phẩy)",
      createTrade: "Tạo giao dịch",
      tradeCreatedSuccess: "Đã tạo giao dịch thành công",
      failedToCreateTrade: "Không thể tạo giao dịch",
      optional: "Tùy chọn",
      enterStrategy: "ví dụ: Swing Trading, Day Trading, Scalping",
      updating: "Đang cập nhật",
      more: "thêm",

      // Form Steps
      assetTypeStep: "Loại tài sản",
      assetTypeStepDesc: "Chọn loại tài sản và mã",
      tradeDetailsStep: "Chi tiết giao dịch",
      tradeDetailsStepDesc: "Nhập chi tiết thực hiện giao dịch",
      analysisNotesStep: "Phân tích & Ghi chú",
      analysisNotesStepDesc: "Thêm chiến lược và ghi chú"
    },

    // AI Assistant
    ai: {
      title: "Trợ lý AI giao dịch",
      subtitle: "Phân tích, thông tin chi tiết và thông tin thị trường được hỗ trợ bởi AI",
      aiSettings: "Cài đặt AI",
      analysis: "Phân tích AI",
      patterns: "Mô hình",
      market: "Thị trường",
      risk: "Rủi ro",

      // AI Trade Analysis Component
      tradeAnalysisTitle: "Phân tích giao dịch AI",
      liveData: "Dữ liệu trực tiếp",
      refreshAnalysis: "Làm mới phân tích",
      aiInsights: "Thông tin chi tiết AI",
      tradeAnalysis: "Phân tích giao dịch",
      aiScore: "Điểm AI",
      riskLevel: "Mức độ rủi ro",
      prediction: "Dự đoán",
      aiReasoning: "Lý do AI:",
      recommendations: "Khuyến nghị:",
      confidence: "Độ tin cậy",
      viewFullAnalysis: "Xem phân tích đầy đủ",

      // Loading and error states
      loadingTradingData: "Đang tải dữ liệu giao dịch của bạn...",
      aiAnalyzing: "AI đang phân tích giao dịch của bạn...",
      noTradesFound: "Không tìm thấy giao dịch. Thêm một số giao dịch để nhận thông tin chi tiết từ AI!",
      errorLoadingData: "Lỗi khi tải dữ liệu giao dịch:",
      retry: "Thử lại",
      updated: "Đã cập nhật",

      // Dynamic text
      insightsFromTrades: "Thông tin chi tiết do AI cung cấp từ {count} giao dịch của bạn • Phân tích thời gian thực",

      // Insight Titles
      excellentWinRate: "Tỷ lệ thắng xuất sắc",
      profitFactorBelowOne: "Hệ số lợi nhuận dưới 1.0",
      highWinRateStrategy: "Chiến lược có tỷ lệ thắng cao",
      unrealizedGains: "Lợi nhuận chưa thực hiện đáng kể",
      frequentLosses: "Các khoản lỗ nhỏ thường xuyên",
      bestStrategy: "Chiến lược tốt nhất",
      highConcentrationRisk: "Rủi ro tập trung cao",
      winRateImprovement: "Cần cải thiện tỷ lệ thắng",
      strongProfitFactor: "Hệ số lợi nhuận mạnh",

      // Insight Descriptions
      winRateDescription: "Tỷ lệ thắng của bạn là {winRate}%, cao hơn mục tiêu của bạn. Hãy tiếp tục phát huy!",
      profitFactorDescription: "Hệ số lợi nhuận hiện tại của bạn là {profitFactor}. Xem lại các giao dịch thua lỗ để xác định các mẫu và cải thiện lợi nhuận.",
      strategyDescription: "\"{strategy}\" cho thấy lợi nhuận {pnl} với tỷ lệ thắng {winRate}% trên {trades} giao dịch.",
      unrealizedGainsDescription: "Bạn có {pnl} lợi nhuận chưa thực hiện trên {symbol}. Cân nhắc đặt lệnh dừng lỗ động để bảo vệ lợi nhuận.",
      frequentLossesDescription: "Bạn có {count} khoản lỗ nhỏ liên tiếp. Xem lại quản lý rủi ro và tiêu chí vào lệnh của bạn.",
      concentrationRiskDescription: "{percentage}% giao dịch trong {asset}. Cân nhắc đa dạng hóa để giảm rủi ro danh mục.",
      winRateImprovementDescription: "Tỷ lệ thắng {winRate}% cho thấy còn chỗ để cải thiện. Cân nhắc tinh chỉnh tiêu chí vào lệnh.",
      strongProfitFactorDescription: "Hệ số lợi nhuận {profitFactor} cho thấy quản lý rủi ro-lợi nhuận xuất sắc.",

      // Trade Analysis Items
      standardMarketConditions: "Điều kiện thị trường tiêu chuẩn",
      largePositionPartialProfit: "Vị thế lớn - cân nhắc chốt lời một phần",
      highRisk: "CAO",
      mediumRisk: "TRUNG BÌNH",
      lowRisk: "THẤP",

      // Buttons & Labels
      actionable: "Có thể hành động",
      viewDetails: "Xem chi tiết",

      // Trade Analysis Reasons
      tradeAnalysisReasons: {
        strategyHighWinRate: "Chiến lược \"{strategy}\" có tỷ lệ thắng {winRate}%",
        strategyLowWinRate: "Chiến lược \"{strategy}\" có tỷ lệ thắng thấp {winRate}%",
        tradeClosedProfitably: "Giao dịch đóng có lời",
        tradeClosedAtLoss: "Giao dịch đóng thua lỗ",
        cryptoHighVolatility: "Tài sản tiền mã hóa có độ biến động cao",
        stockModerateRisk: "Giao dịch cổ phiếu với rủi ro vừa phải",
        standardMarketConditions: "Điều kiện thị trường tiêu chuẩn"
      },

      // Trade Analysis Recommendations
      tradeAnalysisRecommendations: {
        monitorForPriceSwings: "Theo dõi chặt chẽ các biến động giá",
        largePositionPartialProfit: "Vị thế lớn - cân nhắc chốt lời một phần",
        setStopLoss: "Đặt cắt lỗ ở -5%",
        considerTakeProfit: "Cân nhắc chốt lời ở +10%",
        followTradingPlan: "Tuân theo kế hoạch giao dịch của bạn"
      },

      // Pattern Recognition
      patternRecognition: "Nhận dạng mẫu",
      realData: "Dữ liệu thực",
      aiPoweredPatternDetection: "Phát hiện mẫu được hỗ trợ bởi AI từ {count} giao dịch của bạn",
      timeframe: "Khung thời gian",
      scanPatterns: "Quét mẫu",
      loadingPatternData: "Đang tải dữ liệu mẫu...",
      scanningPatterns: "Đang quét mẫu...",
      detectedPatterns: "Mẫu đã phát hiện ({count})",
      noSignificantPatterns: "Không phát hiện mẫu đáng kể nào",
      addMoreTradesAnalysis: "Thêm giao dịch để phân tích tốt hơn",
      winningStrategyPattern: "Mẫu chiến lược thắng",
      lossPatternAlert: "Cảnh báo mẫu thua lỗ",
      patternConfidence: "độ tin cậy",
      success: "Thành công",
      target: "Mục tiêu",
      stopLoss: "Cắt lỗ",
      patternPerformance: "Hiệu suất mẫu",
      winRate: "tỷ lệ thắng",
      totalTrades: "Tổng giao dịch",
      successful: "Thành công",
      avgReturn: "Lợi nhuận TB",
      bestReturn: "Lợi nhuận tốt nhất",
      noPerformanceData: "Không có dữ liệu hiệu suất",

      // News
      news: {
        title: "Tin tức",
        filters: {
          all: "Tất cả",
          positive: "Tích cực",
          negative: "Tiêu cực",
          neutral: "Trung tính"
        },
        impact: {
          high: "Tác động lớn",
          medium: "Tác động vừa",
          low: "Tác động thấp"
        },
        items: {
          techStocksRally: {
            title: "Cổ phiếu công nghệ tăng mạnh nhờ báo cáo lợi nhuận tích cực",
            summary: "Các công ty công nghệ lớn báo cáo lợi nhuận vượt kỳ vọng, thúc đẩy tăng trưởng toàn ngành."
          },
          fedRateCut: {
            title: "Fed gợi ý về việc cắt giảm lãi suất",
            summary: "Các quan chức Fed đề xuất khả năng điều chỉnh lãi suất trong cuộc họp sắp tới."
          },
          energyVolatility: {
            title: "Dự kiến biến động trong lĩnh vực năng lượng",
            summary: "Biến động giá dầu có thể ảnh hưởng đến hiệu suất cổ phiếu năng lượng tuần này."
          },
          cryptoVolatility: {
            title: "Thị trường tiền điện tử cho thấy sự biến động",
            summary: "Bitcoin và các altcoin chính trải qua biến động giá đáng kể do lo ngại về quy định."
          }
        }
      },

      // Market Data Dashboard
      marketDataDashboard: {
        title: "Bảng điều khiển dữ liệu thị trường",
        subtitle: "Dữ liệu thị trường thời gian thực và tín hiệu giao dịch",
        lastUpdate: "Cập nhật",
        refreshButton: "Làm mới dữ liệu",
        loading: "Đang tải dữ liệu thị trường...",
        portfolioAnalysis: {
          title: "Phân tích danh mục",
          positive: "tích cực",
          negative: "tiêu cực",
          neutral: "trung tính",
          trades: "giao dịch",
          winRate: "Tỷ lệ thắng",
          totalQuantity: "Tổng số lượng",
          avgPnL: "P&L trung bình",
          tradeCount: "Số giao dịch",
          performance: "Hiệu suất"
        },
        recommendations: {
          title: "Khuyến nghị giao dịch",
          confidence: "Độ tin cậy",
          high: "cao",
          medium: "trung bình",
          low: "thấp"
        },
        alerts: {
          title: "Cảnh báo & Thông báo thị trường",
          highVolatility: {
            title: "Cảnh báo biến động cao",
            description: "TSLA cho thấy những đợt tăng khối lượng bất thường. Hãy cân nhắc điều chỉnh kích thước vị thế."
          },
          momentumBreakout: {
            title: "Đột phá động lượng",
            description: "NVDA vượt trên kháng cự tại $450. Phát hiện tín hiệu tăng mạnh."
          },
          priceTarget: {
            title: "Đạt mục tiêu giá",
            description: "AAPL đã đạt mục tiêu giá $175 của bạn. Hãy cân nhắc chốt lời."
          }
        }
      },

      // Risk Management
      riskManagement: {
        title: "Quản lý rủi ro",
        subtitle: "Phân tích rủi ro danh mục và máy tính kích thước vị thế",
        analyzeButton: "Phân tích rủi ro",
        loading: "Đang tính toán chỉ số rủi ro...",
        riskParameters: {
          title: "Tham số rủi ro",
          portfolioValue: "Giá trị danh mục ($)",
          maxRiskPerTrade: "Rủi ro tối đa mỗi giao dịch (%)"
        },
        riskMetrics: {
          title: "Chỉ số rủi ro danh mục",
          limit: "Giới hạn",
          status: {
            safe: "An toàn",
            warning: "Cảnh báo", 
            danger: "Nguy hiểm"
          },
          valueAtRisk: {
            name: "Giá trị rủi ro",
            description: "Tổn thất tối đa dự kiến trong 1 ngày với độ tin cậy 95%",
            recommendation: "Nên đa dạng hóa nếu VAR vượt quá 3% danh mục"
          },
          sharpeRatio: {
            name: "Tỷ lệ Sharpe",
            description: "Đo lường lợi nhuận đã điều chỉnh rủi ro",
            recommendation: "Hướng tới tỷ lệ Sharpe trên 1.0 để có lợi nhuận tốt điều chỉnh rủi ro"
          },
          maxDrawdown: {
            name: "Sụt giảm tối đa",
            description: "Mức sụt giảm lớn nhất từ đỉnh xuống đáy của giá trị danh mục",
            recommendation: "Giữ sụt giảm dưới 20% thông qua điều chỉnh kích thước vị thế"
          }
        },
        positionSizing: {
          title: "Máy tính kích thước vị thế",
          riskAmount: "Số tiền rủi ro mỗi giao dịch",
          current: "Vị thế hiện tại",
          suggested: "Vị thế đề xuất", 
          maxPosition: "Kích thước vị thế tối đa",
          entryPrice: "Giá vào lệnh",
          stopLoss: "Cắt lỗ",
          applyButton: "Áp dụng vị thế"
        },
        riskScenarios: {
          title: "Kịch bản rủi ro",
          chance: "khả năng",
          probability: "Xác suất",
          impact: "Tác động",
          portfolioLoss: "Tổn thất danh mục",
          affectedPositions: "Vị thế bị ảnh hưởng",
          mitigation: "Chiến lược giảm thiểu",
          marketCrash: {
            name: "Sụp đổ thị trường (giảm 20%)"
          },
          sectorDownturn: {
            name: "Suy thoái theo ngành"
          },
          interestRateRise: {
            name: "Tăng lãi suất"
          },
          mitigationMeasures: {
            marketCrash: [
              "Đa dạng hóa các loại tài sản",
              "Duy trì dự trữ tiền mặt",
              "Sử dụng lệnh cắt lỗ"
            ],
            sectorDownturn: [
              "Đa dạng hóa các ngành",
              "Theo dõi tin tức ngành",
              "Giảm tập trung vị thế"
            ],
            interestRateRise: [
              "Giảm rủi ro thời gian",
              "Tập trung vào các ngành kháng lãi suất",
              "Xem xét bảo vệ lạm phát"
            ]
          }
        }
      },

      // Chat & Messages
      messages: {
        initialMessage: "Xin chào! Tôi là AI Trading Assistant. Tôi có thể giúp bạn phân tích giao dịch hôm nay như thế nào?",
        placeholder: "Hỏi tôi bất cứ điều gì về giao dịch của bạn...",
        sendButton: "Gửi"
      },
      chat: "Trò chuyện AI",
      marketNews: "Tin tức & Phân tích thị trường",
      portfolioAnalysis: "Phân tích danh mục",
      quickQuestions: "Câu hỏi nhanh",
      analyzePerformance: "Phân tích hiệu suất gần đây của tôi",
      bestPatterns: "Mô hình giao dịch tốt nhất của tôi là gì?",
      diversifyPortfolio: "Tôi có nên đa dạng hóa danh mục không?",
      improveWinRate: "Làm thế nào để cải thiện tỷ lệ thắng?",
      riskExposure: "Mức độ rủi ro của tôi là gì?",
      positionSizing: "Đề xuất kích thước vị thế cho AAPL",
      aiGreeting: "Xin chào! Tôi là trợ lý AI giao dịch của bạn. Tôi có thể giúp bạn phân tích giao dịch như thế nào hôm nay?"
    },

    // Analytics
    analytics: {
      title: "Phân tích giao dịch",
      subtitle: "Cái nhìn toàn diện về hiệu suất giao dịch của bạn",
      refreshData: "Làm mới dữ liệu",
      loading: "Đang tải...",
      loadingAnalytics: "Đang tải phân tích...",
      accessDenied: "Truy cập bị từ chối",
      pleaseLogin: "Vui lòng đăng nhập để truy cập phân tích",
      goToLogin: "Đến trang đăng nhập",

      // KPI Cards
      totalPnl: "Tổng P&L",
      winRate: "Tỷ lệ thắng",
      totalTrades: "Tổng giao dịch",
      profitFactor: "Hệ số lợi nhuận",
      trades: "giao dịch",
      months: "tháng",
      profitable: "Có lợi nhuận",
      unprofitable: "Không có lợi nhuận",

      // Performance Breakdown
      performanceBreakdown: "Phân tích hiệu suất",
      averageWin: "Lãi trung bình",
      averageLoss: "Lỗ trung bình",
      bestTrade: "Giao dịch tốt nhất",
      worstTrade: "Giao dịch tệ nhất",

      // Monthly Performance
      monthlyPerformance: "Hiệu suất hàng tháng",
      monthlyPnl: "P&L hàng tháng",

      // Charts
      pnlOverTime: "P&L theo thời gian",
      assetDistribution: "Phân bổ tài sản",
      cumulativePnl: "P&L tích lũy",
      volume: "Khối lượng",

      // Additional Metrics
      riskMetrics: "Chỉ số rủi ro",
      tradingHabits: "Thói quen giao dịch",
      volumeMetrics: "Chỉ số khối lượng",
      maxDrawdown: "Sụt giảm tối đa",
      totalVolume: "Tổng khối lượng",
      activePositions: "Vị thế đang hoạt động",
      recentTrades: "Giao dịch gần đây",
      assetTypes: "Loại tài sản",
      avgTradeSize: "Kích thước giao dịch trung bình",
      largestPosition: "Vị thế lớn nhất"
    },

    // Settings
    settings: {
      title: "Cài đặt",
      subtitle: "Quản lý tài khoản và tùy chọn của bạn",
      profile: "Hồ sơ",
      preferences: "Tùy chọn",
      security: "Bảo mật",
      notifications: "Thông báo",
      language: "Ngôn ngữ",
      timezone: "Múi giờ",
      currency: "Tiền tệ",
      theme: "Giao diện",
      english: "English",
      vietnamese: "Tiếng Việt",
      save: "Lưu thay đổi",
      cancel: "Hủy",
      saveSuccess: "Lưu cài đặt thành công",
      saveError: "Lỗi khi lưu cài đặt"
    },

    // Common
    common: {
      loading: "Đang tải...",
      error: "Lỗi",
      success: "Thành công",
      warning: "Cảnh báo",
      info: "Thông tin",
      confirm: "Xác nhận",
      yes: "Có",
      no: "Không",
      ok: "Đồng ý",
      cancel: "Hủy",
      save: "Lưu",
      edit: "Sửa",
      delete: "Xóa",
      add: "Thêm",
      search: "Tìm kiếm",
      filter: "Lọc",
      sort: "Sắp xếp",
      export: "Xuất",
      import: "Nhập",
      refresh: "Làm mới",
      back: "Quay lại",
      next: "Tiếp theo",
      previous: "Trước",
      close: "Đóng",
      open: "Mở",
      view: "Xem",
      accessDenied: "Truy cập bị từ chối",
      pleaseLogin: "Vui lòng đăng nhập để truy cập bảng điều khiển",
      welcome: "Chào mừng bạn trở lại",
      loadingAnalytics: "Đang tải phân tích...",
      analyzingData: "Đang phân tích dữ liệu giao dịch của bạn",
      tryAgain: "Thử lại",
      details: "Chi tiết"
    },

    // Forms
    forms: {
      email: "Email",
      password: "Mật khẩu",
      confirmPassword: "Xác nhận mật khẩu",
      displayName: "Tên hiển thị",
      fullName: "Họ và tên",
      firstName: "Tên",
      lastName: "Họ",
      phone: "Số điện thoại",
      address: "Địa chỉ",
      city: "Thành phố",
      country: "Quốc gia",
      zipCode: "Mã bưu điện",
      required: "Trường này là bắt buộc",
      invalidEmail: "Địa chỉ email không hợp lệ",
      passwordTooShort: "Mật khẩu phải có ít nhất 8 ký tự",
      passwordsNotMatch: "Mật khẩu không khớp",
      passwordMinLength: "Mật khẩu phải có ít nhất 6 ký tự",
      invalidNumber: "Số không hợp lệ",
      invalidDate: "Ngày không hợp lệ",
      submit: "Gửi",
      submitting: "Đang gửi...",
      loginButton: "Đăng nhập",
      registerButton: "Đăng ký",
      loginTitle: "Chào mừng trở lại",
      loginSubtitle: "Đăng nhập vào tài khoản của bạn",
      registerTitle: "Tạo tài khoản",
      registerSubtitle: "Đăng ký tài khoản mới",
      noAccount: "Chưa có tài khoản?",
      hasAccount: "Đã có tài khoản?",
      signUp: "Đăng ký",
      signIn: "Đăng nhập",
      forgotPassword: "Quên mật khẩu?",
      rememberMe: "Ghi nhớ đăng nhập",
      selectOption: "Chọn một tùy chọn",
      enterValue: "Nhập giá trị",
      fullNamePlaceholder: "Nguyễn Văn A",
      emailPlaceholder: "nguyen@example.com",
      passwordPlaceholder: "Nhập mật khẩu",
      confirmPasswordPlaceholder: "Xác nhận mật khẩu",
      creatingAccount: "Đang tạo tài khoản...",
      createAccount: "Tạo tài khoản"
    }
  }
} as const;

export type Language = keyof typeof dictionaries;
export type DictionaryKeys = typeof dictionaries.en;
