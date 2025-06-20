document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('tcText', async (data) => {
    const text = data.tcText || "";
    const recommendationSection = document.getElementById('recommendation-section');
    const analysisContent = document.getElementById('analysis-content');
    
    if (!text) {
      analysisContent.innerHTML = '<div class="loading">Select Terms & Conditions text, right-click, and choose "🤖 Analyze with AI" to get smart recommendations.</div>';
      return;
    }

    // Show loading
    recommendationSection.innerHTML = '<div class="loading"><div class="spinner"></div>Gemini AI is analyzing...</div>';
    analysisContent.innerHTML = '<div class="loading">Processing terms and conditions...</div>';

    try {
      const analysis = await analyzeWithGemini(text);
      displayResults(analysis, recommendationSection, analysisContent);
    } catch (error) {
      console.error('Gemini Analysis failed:', error);

      recommendationSection.innerHTML = `
        <div class="recommendation proceed-with-caution">
          <h4><span class="recommendation-icon">❌</span>AI Connection Failed</h4>
          <p>Error: ${error.message}. Using basic analysis instead.</p>
        </div>
      `;

      const basicAnalysis = analyzeBasic(text);
      displayBasicResults(basicAnalysis, recommendationSection, analysisContent);
    }
  });
});

async function analyzeWithGemini(text) {
  console.log('Calling your secure Vercel Gemini API...');

  const prompt = `You are a legal expert analyzing Terms & Conditions. 

Analyze the following terms and provide:
1. Overall recommendation (ACCEPT/REJECT/PROCEED_WITH_CAUTION)
2. 5 key risk points with brief explanations
3. Reason for your recommendation

Focus on data privacy, third-party sharing, termination clauses, user rights, and hidden fees.

Terms & Conditions:
${text.substring(0, 1500)}

Provide your analysis in this format:
RECOMMENDATION: [ACCEPT/REJECT/PROCEED_WITH_CAUTION]
REASON: [Brief explanation]
RISKS:
1. [Risk point 1]
2. [Risk point 2]
3. [Risk point 3]
4. [Risk point 4]
5. [Risk point 5]`;

  const response = await fetch("https://term-and-condition-analyser-extenti.vercel.app/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userPrompt: prompt })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Secure API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response format from Gemini API');
  }

  return parseGeminiResponse(data.candidates[0].content.parts[0].text);
}

function parseGeminiResponse(geminiText) {
  const lines = geminiText.split('\n').filter(line => line.trim());
  
  let recommendation = 'PROCEED_WITH_CAUTION';
  let explanation = '';
  let risks = [];
  
  const recLine = lines.find(line => line.includes('RECOMMENDATION:'));
  if (recLine) {
    if (recLine.includes('ACCEPT') && !recLine.includes('NOT')) {
      recommendation = 'ACCEPT';
    } else if (recLine.includes('REJECT')) {
      recommendation = 'REJECT';
    }
  }
  
  const reasonLine = lines.find(line => line.includes('REASON:'));
  if (reasonLine) {
    explanation = reasonLine.replace('REASON:', '').trim();
  }

  lines.forEach(line => {
    if (line.match(/^\d+\./)) {
      const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
      if (cleanLine.length > 10) {
        risks.push(cleanLine);
      }
    }
  });

  if (risks.length === 0) {
    const sentences = geminiText.split('.').filter(s => s.trim().length > 20);
    risks = sentences.slice(0, 5).map(s => s.trim());
  }

  return {
    recommendation,
    explanation: explanation || 'AI analysis completed successfully',
    risks: risks.slice(0, 5)
  };
}

function displayResults(analysis, recommendationSection, analysisContent) {
  const recClass = analysis.recommendation.toLowerCase().replace('_', '-');
  const recIcon = {
    'accept': '✅',
    'reject': '❌', 
    'proceed-with-caution': '⚠️'
  }[recClass] || '⚠️';

  const recText = analysis.recommendation.replace('_', ' ');

  recommendationSection.innerHTML = `
    <div class="recommendation ${recClass}">
      <h4><span class="recommendation-icon">${recIcon}</span>
      AI Recommendation: ${recText}</h4>
      <p>${analysis.explanation}</p>
    </div>
  `;

  if (analysis.risks.length > 0) {
    const risksHtml = analysis.risks.map((risk, index) => 
      `<div class="risk-point">
        <strong>⚠️ Point ${index + 1}:</strong> ${risk}
      </div>`
    ).join('');
    
    analysisContent.innerHTML = `
      <h4>AI Analysis - Key Points:</h4>
      ${risksHtml}
    `;
  } else {
    analysisContent.innerHTML = '<div class="risk-point">AI analysis completed. Review the recommendation above.</div>';
  }
}

function displayBasicResults(analysis, recommendationSection, analysisContent) {
  recommendationSection.innerHTML = `
    <div class="recommendation proceed-with-caution">
      <h4><span class="recommendation-icon">⚠️</span>Basic Analysis (AI Unavailable)</h4>
      <p>Proceeding with caution recommended. Manual review suggested.</p>
    </div>
  `;

  const risksHtml = analysis.map(point => 
    `<div class="risk-point"><strong>${point.icon}</strong> ${point.title}: ${point.description}</div>`
  ).join('');
  
  analysisContent.innerHTML = risksHtml;
}

function analyzeBasic(text) {
  const lowerText = text.toLowerCase();
  const points = [];

  if (lowerText.includes('collect') || lowerText.includes('personal data') || lowerText.includes('information')) {
    points.push({
      icon: '🔒',
      title: 'Data Collection',
      description: 'Personal information may be collected and stored'
    });
  }

  if (lowerText.includes('third party') || lowerText.includes('partners') || lowerText.includes('share')) {
    points.push({
      icon: '↗',
      title: 'Third-Party Sharing', 
      description: 'Data may be shared with external companies'
    });
  }

  if (lowerText.includes('terminate') || lowerText.includes('suspend') || lowerText.includes('cancel')) {
    points.push({
      icon: '⏹',
      title: 'Account Termination',
      description: 'Service can terminate your account under certain conditions'
    });
  }

  if (lowerText.includes('fee') || lowerText.includes('charge') || lowerText.includes('payment')) {
    points.push({
      icon: '💰',
      title: 'Fees & Charges',
      description: 'Additional fees or charges may apply'
    });
  }

  if (lowerText.includes('cookie') || lowerText.includes('tracking') || lowerText.includes('analytics')) {
    points.push({
      icon: '🍪',
      title: 'Tracking & Cookies',
      description: 'Website uses cookies and tracking technologies'
    });
  }

  return points.slice(0, 5);
}
