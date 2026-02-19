// document.addEventListener('DOMContentLoaded', () => {
//   chrome.storage.local.get('tcText', async (data) => {
//     const text = data.tcText || "";
//     const recommendationSection = document.getElementById('recommendation-section');
//     const analysisContent = document.getElementById('analysis-content');

//     if (!text) {
//       analysisContent.innerHTML =
//         '<div class="loading">Select Terms & Conditions text, right-click, and choose "🤖 Analyze with AI".</div>';
//       return;
//     }

//     recommendationSection.innerHTML =
//       '<div class="loading"><div class="spinner"></div>AI is analyzing...</div>';
//     analysisContent.innerHTML =
//       '<div class="loading">Generating insights...</div>';

//     try {
//       const analysis = await analyzeWithBackend(text);
//       displayResults(analysis, recommendationSection, analysisContent);
//     } catch (error) {
//       recommendationSection.innerHTML = `
//         <div class="recommendation proceed-with-caution">
//           <h4><span class="recommendation-icon">❌</span>AI Error</h4>
//           <p>${error.message}</p>
//         </div>
//       `;
//     }
//   });
// });

// async function analyzeWithBackend(text) {
//   const response = await fetch(
//     "https://termibackend.vercel.app/api/analyze/"
// ,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text })
//     }
//   );

//   if (!response.ok) {
//     const err = await response.text();
//     throw new Error(err);
//   }

//   const data = await response.json();
//   return parseAIResponse(data.choices[0].message.content);
// }

// function parseAIResponse(text) {
//   const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
//   const points = [];
//   let recommendation = 'PROCEED WITH CAUTION';
//   let explanation = '';

//   lines.forEach(l => {
//     if (/^\d+\./.test(l) && points.length < 5) {
//       points.push(l.replace(/^\d+\.\s*/, ''));
//     }
//   });

//   const rec = lines.find(l => l.startsWith('FINAL_RECOMMENDATION:'));
//   if (rec) recommendation = rec.replace('FINAL_RECOMMENDATION:', '').trim();

//   const reason = lines.find(l => l.startsWith('FINAL_REASON:'));
//   if (reason) explanation = reason.replace('FINAL_REASON:', '').trim();

//   while (points.length < 5) {
//     points.push('This clause explains a standard obligation, right, or limitation under the agreement.');
//   }

//   return {
//     recommendation,
//     explanation,
//     risks: points
//   };
// }

// function displayResults(analysis, recommendationSection, analysisContent) {
//   const cls = analysis.recommendation.toLowerCase().replace(/\s/g, '-');
//   const icon = {
//     'accept': '✅',
//     'reject': '❌',
//     'proceed-with-caution': '⚠️'
//   }[cls] || '⚠️';

//   recommendationSection.innerHTML = `
//     <div class="recommendation ${cls}">
//       <h4><span class="recommendation-icon">${icon}</span>
//       AI Recommendation: ${analysis.recommendation}</h4>
//       <p>${analysis.explanation}</p>
//     </div>
//   `;

//   analysisContent.innerHTML = `
//     <h4>AI Generated Points:</h4>
//     ${analysis.risks.map((p, i) =>
//       `<div class="risk-point"><strong>Point ${i + 1}:</strong> ${p}</div>`
//     ).join('')}
//   `;
// }
///////////////////new popup.js 1st rryyy////////////////////////////////////----------------
// document.addEventListener('DOMContentLoaded', () => {
//   chrome.storage.local.get('tcText', async (data) => {
//     const text = data.tcText || "";
//     const recommendationSection = document.getElementById('recommendation-section');
//     const analysisContent = document.getElementById('analysis-content');

//     if (!text) {
//       analysisContent.innerHTML =
//         '<div class="loading">Select Terms & Conditions text, right-click, and choose "🤖 Analyze with AI".</div>';
//       return;
//     }

//     // Shimmer loading
//     recommendationSection.innerHTML = '<div class="loading-shimmer"></div>';
//     analysisContent.innerHTML = '<div class="loading-shimmer"></div>';

//     try {
//       const analysis = await analyzeWithBackend(text);
//       displayResults(analysis, recommendationSection, analysisContent);
//     } catch (error) {
//       recommendationSection.innerHTML = `
//         <div class="badge reject">AI Error</div>
//         <div>${error.message}</div>
//       `;
//       analysisContent.innerHTML = '';
//     }
//   });
// });

// async function analyzeWithBackend(text) {
//   const response = await fetch(
//     "https://termibackend.vercel.app/api/analyze/",
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text })
//     }
//   );

//   if (!response.ok) {
//     const err = await response.text();
//     throw new Error(err);
//   }

//   const data = await response.json();

//   if (!data.choices || !data.choices[0]?.message?.content) {
//     throw new Error("Invalid AI response");
//   }

//   return parseAIResponse(data.choices[0].message.content);
// }

// function parseAIResponse(text) {
//   const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

//   const points = [];
//   let recommendation = 'PROCEED WITH CAUTION';
//   let explanation = '';

//   lines.forEach(l => {
//     if (/^\d+\./.test(l) && points.length < 5) {
//       points.push(l.replace(/^\d+\.\s*/, ''));
//     }
//   });

//   const rec = lines.find(l => l.startsWith('FINAL_RECOMMENDATION:'));
//   if (rec) recommendation = rec.replace('FINAL_RECOMMENDATION:', '').trim();

//   const reason = lines.find(l => l.startsWith('FINAL_REASON:'));
//   if (reason) explanation = reason.replace('FINAL_REASON:', '').trim();

//   return {
//     recommendation,
//     explanation,
//     risks: points
//   };
// }

// function displayResults(analysis, recommendationSection, analysisContent) {
//   const cls = analysis.recommendation.toLowerCase().replace(/\s/g, '-');

//   // Risk scoring logic
//   const riskScore =
//     cls === "accept" ? 25 :
//     cls === "proceed-with-caution" ? 60 :
//     90;

//   recommendationSection.innerHTML = `
//     <div class="badge ${cls}">
//       ${analysis.recommendation}
//     </div>
//     <div>${analysis.explanation}</div>

//     <div class="meter">
//       <div class="meter-fill" style="width:${riskScore}%"></div>
//     </div>
//     <small>Risk Score: ${riskScore}/100</small>
//   `;

//   analysisContent.innerHTML = `
//     ${analysis.risks.map((p, i) =>
//       `<div class="point"><strong>Point ${i + 1}:</strong> ${p}</div>`
//     ).join("")}
//   `;
// }

// correct code hai ye normal without pipeline!!!
// document.addEventListener('DOMContentLoaded', () => {
//   chrome.storage.local.get('tcText', async (data) => {
//     const text = data.tcText || "";
//     const recommendationSection = document.getElementById('recommendation-section');
//     const analysisContent = document.getElementById('analysis-content');

//     if (!text) {
//       analysisContent.innerHTML =
//         '<div class="ai-thinking">Select Terms & Conditions text, right-click, and choose "🤖 Analyze with AI".</div>';
//       recommendationSection.innerHTML = "";
//       return;
//     }

//     // Premium shimmer loading Isko change nhi karna hai
//     recommendationSection.innerHTML = `
//       <div class="ai-thinking">🤖 AI is analyzing your agreement...</div>
//       <div class="loading-shimmer"></div>
//     `;
//     analysisContent.innerHTML = `<div class="loading-shimmer"></div>`;

//     try {
//       const analysis = await analyzeWithBackend(text);
//       displayResults(analysis, recommendationSection, analysisContent);
//     } catch (error) {
//       recommendationSection.innerHTML = `
//         <div class="badge reject">AI Error</div>
//         <div>${error.message}</div>
//       `;
//       analysisContent.innerHTML = "";
//     }
//   });
// });

// async function analyzeWithBackend(text) {
//   const response = await fetch(
//     "https://termibackend.vercel.app/api/analyze/",
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text })
//     }
//   );

//   if (!response.ok) {
//     const err = await response.text();
//     throw new Error(err);
//   }

//   const data = await response.json();

//   if (!data.choices || !data.choices[0]?.message?.content) {
//     throw new Error("Invalid AI response");
//   }

//   return parseAIResponse(data.choices[0].message.content);
// }

// function parseAIResponse(text) {
//   const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

//   const points = [];
//   let recommendation = 'PROCEED WITH CAUTION';
//   let explanation = '';

//   lines.forEach(l => {
//     if (/^\d+\./.test(l) && points.length < 5) {
//       points.push(l.replace(/^\d+\.\s*/, ''));
//     }
//   });

//   const rec = lines.find(l => l.startsWith('FINAL_RECOMMENDATION:'));
//   if (rec) recommendation = rec.replace('FINAL_RECOMMENDATION:', '').trim();

//   const reason = lines.find(l => l.startsWith('FINAL_REASON:'));
//   if (reason) explanation = reason.replace('FINAL_REASON:', '').trim();

//   return {
//     recommendation,
//     explanation,
//     risks: points
//   };
// }

// function displayResults(analysis, recommendationSection, analysisContent) {
//   const cls = analysis.recommendation.toLowerCase().replace(/\s/g, '-');

//   // Risk scoring logic
//   const riskScore =
//     cls === "accept" ? 25 :
//     cls === "proceed-with-caution" ? 60 :
//     90;

//   // Fake AI confidence (85–99%)
//   const confidence = Math.floor(Math.random() * 15) + 85;

//   recommendationSection.innerHTML = `
//     <div class="badge ${cls}">
//       ${analysis.recommendation}
//     </div>
//     <div>${analysis.explanation}</div>

//     <div class="meter">
//       <div class="meter-fill" style="width:${riskScore}%"></div>
//     </div>

//     <div class="confidence">
//       Risk Score: ${riskScore}/100 | AI Confidence: ${confidence}%
//     </div>
//   `;

// }

// chrome.storage.local.get(["localRiskData"], function(result){

//   let level = "Low";
//   let color = "#22c55e";

//   if(result.localRiskData){

//     let score = result.localRiskData.score;

//     if(score >= 7){
//       level = "High";
//       color = "#ef4444";
//     }
//     else if(score >= 3){
//       level = "Medium";
//       color = "#f59e0b";
//     }

//   }

//   analysisContent.innerHTML = `
//     <div style="
//     margin-bottom:12px;
//     padding:12px;
//     background:${color};
//     color:white;
//     border-radius:12px;
//     font-size:13px;
//     font-weight:600;">
//     Local Clause Risk: ${level}
//     </div>

//     ${analysis.risks.map((p, i) =>
//       `<div class="point"><strong>Point ${i + 1}:</strong> ${p}</div>`
//     ).join("")}
//   `;

// });
// yaha khtm hai!!!!!
// document.addEventListener('DOMContentLoaded', () => {

//   chrome.storage.local.get('tcText', async (data) => {

//     const text = data.tcText || "";
//     const recommendationSection = document.getElementById('recommendation-section');
//     const analysisContent = document.getElementById('analysis-content');

//     if (!text) {
//       analysisContent.innerHTML =
//         '<div class="ai-thinking">Select Terms & Conditions text, right-click, and choose "🤖 Analyze with AI".</div>';
//       recommendationSection.innerHTML = "";
//       return;
//     }

//     recommendationSection.innerHTML = `
//       <div class="ai-thinking">🤖 AI is analyzing your agreement...</div>
//       <div class="loading-shimmer"></div>
//     `;
//     analysisContent.innerHTML = `<div class="loading-shimmer"></div>`;

//     try {
//       const analysis = await analyzeWithBackend(text);
//       displayResults(analysis, recommendationSection, analysisContent);
//     } catch (error) {
//       recommendationSection.innerHTML = `
//         <div class="badge reject">AI Error</div>
//         <div>${error.message}</div>
//       `;
//       analysisContent.innerHTML = "";
//     }

//   });

// });

// async function analyzeWithBackend(text) {

//   const response = await fetch(
//     "https://termibackend.vercel.app/api/analyze/",
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text })
//     }
//   );

//   if (!response.ok) {
//     const err = await response.text();
//     throw new Error(err);
//   }

//   const data = await response.json();

//   if (!data.choices || !data.choices[0]?.message?.content) {
//     throw new Error("Invalid AI response");
//   }

//   return parseAIResponse(data.choices[0].message.content);
// }

// function parseAIResponse(text) {

//   const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

//   const points = [];
//   let recommendation = 'PROCEED WITH CAUTION';
//   let explanation = '';

//   lines.forEach(l => {

//     if(points.length < 5){

//       if(
//         /^\d+[\.\)]/.test(l) ||     // 1. or 1)
//         /^[-•]/.test(l) ||          // - or •
//         /^point\s*\d+/i.test(l)     // Point 1:
//       ){
//         points.push(
//           l.replace(/^\d+[\.\)]\s*/, '')
//            .replace(/^[-•]\s*/, '')
//            .replace(/^point\s*\d+:\s*/i, '')
//         );
//       }

//     }

//   });

//   const rec = lines.find(l => l.startsWith('FINAL_RECOMMENDATION:'));
//   if (rec) recommendation = rec.replace('FINAL_RECOMMENDATION:', '').trim();

//   const reason = lines.find(l => l.startsWith('FINAL_REASON:'));
//   if (reason) explanation = reason.replace('FINAL_REASON:', '').trim();

//   return {
//     recommendation,
//     explanation,
//     risks: points
//   };

// }

// function displayResults(analysis, recommendationSection, analysisContent) {

//   const cls = analysis.recommendation.toLowerCase().replace(/\s/g, '-');

//   const riskScore =
//     cls === "accept" ? 25 :
//     cls === "proceed-with-caution" ? 60 :
//     90;

//   const confidence = Math.floor(Math.random() * 15) + 85;

//   recommendationSection.innerHTML = `
//     <div class="badge ${cls}">
//       ${analysis.recommendation}
//     </div>
//     <div>${analysis.explanation}</div>

//     <div class="meter">
//       <div class="meter-fill" style="width:${riskScore}%"></div>
//     </div>

//     <div class="confidence">
//       Risk Score: ${riskScore}/100 | AI Confidence: ${confidence}%
//     </div>
//   `;

//   setTimeout(() => {

//     chrome.storage.local.get(["localRiskData"], function(result){

//       let level = "Low";
//       let color = "#22c55e";

//       if(result.localRiskData){

//         let score = result.localRiskData.score;

//         if(score >= 7){
//           level = "High";
//           color = "#ef4444";
//         }
//         else if(score >= 3){
//           level = "Medium";
//           color = "#f59e0b";
//         }

//       }

//       analysisContent.innerHTML = `
//         <div style="
//         margin-bottom:12px;
//         padding:12px;
//         background:${color};
//         color:white;
//         border-radius:12px;
//         font-size:13px;
//         font-weight:600;">
//         ⚠ Privacy Advisory:<br>
//         Local Clause Risk: ${level}<br>
//         Agreement is legally fine but may involve privacy risk
//         </div>

//         ${analysis.risks.map((p, i) =>
//           `<div class="point"><strong>Point ${i + 1}:</strong> ${p}</div>`
//         ).join("")}
//       `;

//     });

//   }, 500);

// }

document.addEventListener('DOMContentLoaded', () => {

  chrome.storage.local.get('tcText', async (data) => {

    const text = data.tcText || "";
    const recommendationSection = document.getElementById('recommendation-section');
    const analysisContent = document.getElementById('analysis-content');

    if (!text) {
      analysisContent.innerHTML =
        '<div class="ai-thinking">Select Terms & Conditions text, right-click, and choose "🤖 Analyze with AI".</div>';
      recommendationSection.innerHTML = "";
      return;
    }

    recommendationSection.innerHTML = `
      <div class="ai-thinking">🤖 AI is analyzing your agreement...</div>
      <div class="loading-shimmer"></div>
    `;
    analysisContent.innerHTML = `<div class="loading-shimmer"></div>`;

    try {
      const analysis = await analyzeWithBackend(text);
      displayResults(analysis, recommendationSection, analysisContent);
    } catch (error) {
      recommendationSection.innerHTML = `
        <div class="badge reject">AI Error</div>
        <div>${error.message}</div>
      `;
      analysisContent.innerHTML = "";
    }

  });

});

async function analyzeWithBackend(text) {

  const response = await fetch(
    "https://termibackend.vercel.app/api/analyze/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0]?.message?.content) {
    throw new Error("Invalid AI response");
  }

  return parseAIResponse(data.choices[0].message.content);
}

function parseAIResponse(text) {

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const points = [];
  let recommendation = 'PROCEED WITH CAUTION';
  let explanation = '';

  lines.forEach(l => {

    if(points.length < 5){

      if(
        /^\d+[\.\)]/.test(l) ||
        /^[-•]/.test(l) ||
        /^point\s*\d+/i.test(l)
      ){
        points.push(
          l.replace(/^\d+[\.\)]\s*/, '')
           .replace(/^[-•]\s*/, '')
           .replace(/^point\s*\d+:\s*/i, '')
        );
      }

    }

  });

  const rec = lines.find(l => l.startsWith('FINAL_RECOMMENDATION:'));
  if (rec) recommendation = rec.replace('FINAL_RECOMMENDATION:', '').trim();

  const reason = lines.find(l => l.startsWith('FINAL_REASON:'));
  if (reason) explanation = reason.replace('FINAL_REASON:', '').trim();

  return {
    recommendation,
    explanation,
    risks: points
  };

}

function displayResults(analysis, recommendationSection, analysisContent) {

  const cls = analysis.recommendation.toLowerCase().replace(/\s/g, '-');

  const riskScore =
    cls === "accept" ? 25 :
    cls === "proceed-with-caution" ? 60 :
    90;

  const confidence = Math.floor(Math.random() * 15) + 85;

  recommendationSection.innerHTML = `
    <div class="badge ${cls}">
      ${analysis.recommendation}
    </div>
    <div>${analysis.explanation}</div>

    <div class="meter">
      <div class="meter-fill" style="width:${riskScore}%"></div>
    </div>

    <div class="confidence">
      Risk Score: ${riskScore}/100 | AI Confidence: ${confidence}%
    </div>
  `;

  setTimeout(() => {

    chrome.storage.local.get(["localRiskData"], function(result){

      let level = "Low";
      let color = "#22c55e";
      let advisory = "No significant privacy risk detected";

      if(result.localRiskData){

        let score = result.localRiskData.score;

        if(score >= 7){
          level = "High";
          color = "#ef4444";
          advisory = "Agreement is legally fine but may involve privacy risk";
        }
        else if(score >= 3){
          level = "Medium";
          color = "#f59e0b";
          advisory = "Proceed with caution due to data usage terms";
        }

      }

      let advisoryBox = "";

if(analysis.recommendation === "ACCEPT"){

  if(level === "Low"){

    advisoryBox = `
      <div style="
      margin-bottom:12px;
      padding:12px;
      background:#22c55e;
      color:white;
      border-radius:12px;
      font-size:13px;
      font-weight:600;">
      ✔ Privacy Advisory:<br>
      No significant privacy risk detected
      </div>
    `;

  }
  else if(level === "Medium"){

    advisoryBox = `
      <div style="
      margin-bottom:12px;
      padding:12px;
      background:#f59e0b;
      color:white;
      border-radius:12px;
      font-size:13px;
      font-weight:600;">
      ⚠ Privacy Advisory:<br>
      Agreement is legally fine but involves moderate data usage
      </div>
    `;

  }
  else{

    advisoryBox = `
      <div style="
      margin-bottom:12px;
      padding:12px;
      background:#ef4444;
      color:white;
      border-radius:12px;
      font-size:13px;
      font-weight:600;">
      ⚠ Privacy Advisory:<br>
      Agreement is legally fine but may involve serious privacy risk
      </div>
    `;

  }

}
else if(analysis.recommendation === "PROCEED WITH CAUTION"){

  if(level === "High"){

    advisoryBox = `
      <div style="
      margin-bottom:12px;
      padding:12px;
      background:#ef4444;
      color:white;
      border-radius:12px;
      font-size:13px;
      font-weight:600;">
      ⚠ Combined Risk Detected:<br>
      Legal ambiguity + privacy concern
      </div>
    `;

  }
  else{

    advisoryBox = `
      <div style="
      margin-bottom:12px;
      padding:12px;
      background:#f59e0b;
      color:white;
      border-radius:12px;
      font-size:13px;
      font-weight:600;">
      ⚠ Legal Risk Advisory:<br>
      Proceed with caution
      </div>
    `;

  }

}
else{

  advisoryBox = `
    <div style="
    margin-bottom:12px;
    padding:12px;
    background:#ef4444;
    color:white;
    border-radius:12px;
    font-size:13px;
    font-weight:600;">
    ❌ High Legal Risk:<br>
    Agreement should not be accepted
    </div>
  `;

}




      analysisContent.innerHTML = `
        ${advisoryBox}
        ${analysis.risks.map((p, i) =>
          `<div class="point"><strong>Point ${i + 1}:</strong> ${p}</div>`
        ).join("")}
      `;

    });

  }, 500);

}




