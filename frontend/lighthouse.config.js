{
  "extends": "lighthouse:default",
  "settings": {
    "onlyCategories": ["performance", "accessibility", "best-practices", "seo"],
    "throttling": {
      "rttMs": 40,
      "throughputKbps": 10240,
      "cpuSlowdownMultiplier": 4
    },
    "formFactor": "desktop",
    "screenEmulation": {
      "mobile": false,
      "width": 1350,
      "height": 940,
      "deviceScaleFactor": 1,
      "disabled": false
    },
    "emulatedUserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36",
    "auditMode": true,
    "gatherMode": false,
    "disableStorageReset": false,
    "disableDeviceEmulation": false,
    "disableNetworkThrottling": false,
    "disableCpuThrottling": false,
    "budgets": [
      {
        "resourceSizes": [
          {
            "resourceType": "script",
            "budget": 300
          },
          {
            "resourceType": "image",
            "budget": 500
          },
          {
            "resourceType": "third-party",
            "budget": 200
          },
          {
            "resourceType": "total",
            "budget": 2000
          }
        ],
        "resourceCounts": [
          {
            "resourceType": "third-party",
            "budget": 10
          },
          {
            "resourceType": "total",
            "budget": 80
          }
        ]
      }
    ]
  },
  "audits": [
    "first-contentful-paint",
    "largest-contentful-paint",
    "first-meaningful-paint",
    "speed-index",
    "interactive",
    "total-blocking-time",
    "cumulative-layout-shift",
    "max-potential-fid",
    "uses-long-cache-ttl",
    "total-byte-weight",
    "offscreen-images",
    "render-blocking-resources",
    "unminified-css",
    "unminified-javascript",
    "unused-css-rules",
    "unused-javascript",
    "uses-optimized-images",
    "uses-webp-images",
    "uses-text-compression",
    "uses-responsive-images",
    "efficiently-encode-images",
    "modern-image-formats",
    "color-contrast",
    "image-alt",
    "label",
    "tabindex",
    "content-width",
    "font-size",
    "tap-targets",
    "hreflang",
    "canonical",
    "structured-data",
    "robots-txt",
    "sitemap-xml",
    "http-status-code",
    "font-display",
    "inspector-issues",
    "js-libraries",
    "deprecations",
    "errors-in-console",
    "valid-source-maps",
    "prioritize-lcp-image",
    "csp-xss",
    "full-page-screenshot",
    "script-treemap-data"
  ],
  "categories": {
    "performance": {
      "title": "Performance",
      "description": "These metrics measure how quickly your page loads and becomes interactive.",
      "auditRefs": [
        {
          "id": "first-contentful-paint",
          "weight": 10,
          "group": "metrics"
        },
        {
          "id": "largest-contentful-paint",
          "weight": 25,
          "group": "metrics"
        },
        {
          "id": "total-blocking-time",
          "weight": 30,
          "group": "metrics"
        },
        {
          "id": "cumulative-layout-shift",
          "weight": 25,
          "group": "metrics"
        },
        {
          "id": "speed-index",
          "weight": 10,
          "group": "metrics"
        },
        {
          "id": "interactive",
          "weight": 0,
          "group": "metrics"
        },
        {
          "id": "uses-long-cache-ttl",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "total-byte-weight",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "offscreen-images",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "render-blocking-resources",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "unminified-css",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "unminified-javascript",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "unused-css-rules",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "unused-javascript",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "uses-optimized-images",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "uses-webp-images",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "uses-text-compression",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "uses-responsive-images",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "efficiently-encode-images",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "modern-image-formats",
          "weight": 0,
          "group": "load-opportunities"
        },
        {
          "id": "prioritize-lcp-image",
          "weight": 0,
          "group": "load-opportunities"
        }
      ]
    },
    "accessibility": {
      "title": "Accessibility",
      "description": "These checks highlight opportunities to improve the accessibility of your web app.",
      "manualDescription": "These items address areas which an automated testing tool cannot cover. Learn more in our guide on [conducting an accessibility review](https://developers.google.com/web/fundamentals/accessibility/how-to-review).",
      "auditRefs": [
        {
          "id": "color-contrast",
          "weight": 3,
          "group": "a11y-color-contrast"
        },
        {
          "id": "image-alt",
          "weight": 10,
          "group": "a11y-names-labels"
        },
        {
          "id": "label",
          "weight": 3,
          "group": "a11y-names-labels"
        },
        {
          "id": "tabindex",
          "weight": 3,
          "group": "a11y-navigation"
        },
        {
          "id": "content-width",
          "weight": 3,
          "group": "a11y-tables-lists"
        },
        {
          "id": "font-size",
          "weight": 3,
          "group": "a11y-legibility"
        },
        {
          "id": "tap-targets",
          "weight": 3,
          "group": "a11y-tap-targets"
        }
      ]
    },
    "best-practices": {
      "title": "Best Practices",
      "description": "We've compiled some recommendations for modernizing your web app and providing a good user experience.",
      "auditRefs": [
        {
          "id": "font-display",
          "weight": 0,
          "group": "fast-and-reliable"
        },
        {
          "id": "inspector-issues",
          "weight": 0,
          "group": "fast-and-reliable"
        },
        {
          "id": "js-libraries",
          "weight": 0,
          "group": "fast-and-reliable"
        },
        {
          "id": "deprecations",
          "weight": 1,
          "group": "general-group"
        },
        {
          "id": "errors-in-console",
          "weight": 1,
          "group": "general-group"
        },
        {
          "id": "valid-source-maps",
          "weight": 0,
          "group": "general-group"
        },
        {
          "id": "csp-xss",
          "weight": 0,
          "group": "general-group"
        }
      ]
    },
    "seo": {
      "title": "SEO",
      "description": "These checks ensure that your page is following basic search engine optimization advice.",
      "manualDescription": "Run these additional validators on your site to check additional SEO best practices.",
      "auditRefs": [
        {
          "id": "hreflang",
          "weight": 1,
          "group": "seo-content"
        },
        {
          "id": "canonical",
          "weight": 1,
          "group": "seo-content"
        },
        {
          "id": "structured-data",
          "weight": 1,
          "group": "seo-content"
        },
        {
          "id": "robots-txt",
          "weight": 1,
          "group": "seo-crawl"
        },
        {
          "id": "sitemap-xml",
          "weight": 1,
          "group": "seo-crawl"
        },
        {
          "id": "http-status-code",
          "weight": 1,
          "group": "seo-crawl"
        }
      ]
    }
  }
}