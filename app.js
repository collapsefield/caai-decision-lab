/* Public demonstration fixtures. Direct lookups only; no inference or scoring. */
(() => {
  'use strict';

  // Fixture data: the present condition and candidates belong to the scenario,
  // never to a history. OFF always selects the scenario's fixed reference action.
  const scenarios = {
    collections: {
      name: 'Collections / Customer Vulnerability', code: 'COL',
      present: 'Customer account is overdue. Contact is permitted. No immediate legal restriction prevents normal case handling.',
      actions: { A: 'Send standard reminder', B: 'Offer payment arrangement', C: 'Request additional information', D: 'Escalate for human review' },
      histories: {
        A: { factors: ['Previous contact succeeded', 'No recorded vulnerability indicator', 'No broken arrangement', 'Customer previously responded to standard contact'], action: 'A' },
        B: { factors: ['Two recent contact attempts failed', 'Previous arrangement broke down', 'Recent vulnerability information recorded', 'Previous automated route did not resolve the case'], action: 'D' }
      }, reference: 'B'
    },
    insurance: {
      name: 'Insurance / Claims Review', code: 'INS',
      present: 'Claim is open. Required core fields are present. Multiple next actions remain permitted under the host workflow.',
      actions: { A: 'Continue normal processing', B: 'Request supporting evidence', C: 'Refer for specialist review', D: 'Escalate for investigation' },
      histories: {
        A: { factors: ['Previous evidence requests were satisfied', 'Identity checks passed', 'No unresolved anomaly in earlier claim activity', 'Prior communication was consistent'], action: 'A' },
        B: { factors: ['Earlier documentation conflicted', 'Previous evidence request remains unresolved', 'Material case information changed after submission', 'Earlier interaction was already referred once'], action: 'C' }
      }, reference: 'B'
    },
    agent: {
      name: 'Stateful AI Agent', code: 'AGT',
      present: 'Agent has a valid user request and four currently permitted next actions.',
      actions: { A: 'Respond directly', B: 'Use authorised tool', C: 'Ask for clarification', D: 'Escalate to human review' },
      histories: {
        A: { factors: ['User previously clarified the relevant preference', 'Previous tool result remains current', 'No unresolved contradiction', 'Similar request previously completed successfully'], action: 'A' },
        B: { factors: ['Previous answer was corrected by the user', 'One important ambiguity remains unresolved', 'Earlier tool result is now stale', 'User previously requested confirmation before action'], action: 'C' }
      }, reference: 'B'
    }
  };

  // Ephemeral page state: nothing is saved to browser storage or sent anywhere.
  const state = { scenario: 'collections', history: 'A', influence: true, runNumber: 0, decision: null, comparisonOpen: false };
  const $ = (id) => document.getElementById(id);
  const escape = (text) => String(text).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const actionText = (scenario, letter) => `${letter} — ${scenario.actions[letter]}`;
  const modeText = (influence) => influence ? 'Governed retained-state selection' : 'Reference condition';
  const factorList = (factors) => `<ul class="factor-list">${factors.map((factor) => `<li>${escape(factor)}</li>`).join('')}</ul>`;
  const animate = (element, name) => {
    element.classList.remove(name);
    void element.offsetWidth;
    element.classList.add(name);
  };

  // These are public fixture labels, not cryptographic attestations or visitor identifiers.
  const fingerprints = (scenario) => ({ present: `DEMO-${scenario.code}-PRESENT-001`, candidates: `DEMO-${scenario.code}-ACTIONS-001` });

  function resolveSelection(scenarioKey, history, influence) {
    const scenario = scenarios[scenarioKey];
    if (!scenario || !scenario.histories[history] || typeof influence !== 'boolean') throw new Error('Unknown demonstration condition.');
    const selected = influence ? scenario.histories[history].action : scenario.reference;
    if (!Object.prototype.hasOwnProperty.call(scenario.actions, selected)) throw new Error('Demonstration action is outside the permitted set.');
    return {
      scenario: scenarioKey, history, influence,
      fixtureId: `DEMO-${scenario.code}-${influence ? history : 'REF'}-001`,
      selected, reference: scenario.reference, governed: scenario.histories[history].action,
      changed: selected !== scenario.reference, ...fingerprints(scenario)
    };
  }

  // Rendering always uses the committed decision snapshot, never stale controls.
  function renderInputs() {
    const scenario = scenarios[state.scenario];
    document.querySelectorAll('[data-scenario]').forEach((tab) => {
      const selected = tab.dataset.scenario === state.scenario;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    $('scenario-panel').setAttribute('aria-labelledby', `tab-${state.scenario}`);
    $('present-condition').textContent = scenario.present;
    $('candidate-list').innerHTML = Object.entries(scenario.actions).map(([letter, text]) => `<li><span class="candidate-letter">${letter}</span><span>${escape(text)}</span></li>`).join('');
    document.querySelectorAll('[data-history]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.history === state.history)));
    $('history-factors').innerHTML = scenario.histories[state.history].factors.map((factor) => `<li>${escape(factor)}</li>`).join('');
    $('influence-toggle').setAttribute('aria-checked', String(state.influence));
    $('influence-toggle').querySelector('.switch-word').textContent = state.influence ? 'ON' : 'OFF';
    $('influence-description').textContent = modeText(state.influence);
    $('flow-history').textContent = state.influence ? `Retained history · ${state.history}` : 'Retained-state influence disabled';
    $('flow-output').textContent = state.influence ? 'Governed selection' : 'Reference condition';
    document.querySelector('.result-panel').classList.toggle('reference-mode', !state.influence);
  }

  function renderResult() {
    const decision = state.decision;
    $('replay-decision').disabled = !decision;
    $('replay-match').textContent = decision?.replayMatch === true ? 'REPLAY MATCH · YES' : decision?.replayMatch === false ? 'REPLAY MATCH · NO' : '';
    $('result-badge').textContent = !decision ? 'Awaiting selection' : decision.influence ? 'Governed' : 'Reference';
    if (!decision) {
      $('result-content').innerHTML = '<div class="waiting"><div class="waiting-symbol" aria-hidden="true">↗</div><h4>Ready when you are</h4><h3>Four permitted actions.<br>One selected outcome.</h3><p>Choose a history and run the selection to see which action wins in this controlled case.</p></div>';
      return;
    }
    const scenario = scenarios[decision.scenario];
    $('result-content').innerHTML = `<div class="result-content-inner"><p class="eyebrow">Selected action</p><div class="result-action"><span class="result-letter">${decision.selected}</span><h4 id="selected-action">${escape(scenario.actions[decision.selected])}</h4></div><p class="mode-line"><span>MODE</span><strong>${modeText(decision.influence)}</strong></p><dl class="status-rows"><div><dt>Present condition</dt><dd>Unchanged</dd></div><div><dt>Candidate set</dt><dd>Unchanged</dd></div><div><dt>Retained history</dt><dd>${decision.influence ? `History ${decision.history}` : 'Influence disabled'}</dd></div></dl><div class="comparison-mini"><p><span class="micro">Reference result</span><span id="reference-action">${escape(actionText(scenario, decision.reference))}</span></p><p><span class="micro">Governed result · History ${decision.history}${decision.influence ? '' : ' · comparison only'}</span><span id="governed-action">${escape(actionText(scenario, decision.governed))}</span></p>${decision.influence ? '' : '<p class="comparison-note">The governed result is shown for comparison only. Influence is disabled; the selected action is the reference result.</p>'}<div class="difference"><span class="micro">Selection difference</span><strong id="selection-difference">${decision.changed ? 'CHANGED' : 'NO CHANGE'}</strong></div></div></div>`;
  }

  function renderRecord() {
    const decision = state.decision;
    if (!decision) {
      $('record-content').innerHTML = '<div class="record-empty"><div class="empty-lines" aria-hidden="true"><span></span><span></span><span></span></div><p>Your Decision Record will appear here after a selection.</p><p>Run details, fixed conditions and relevant history — in one inspectable record.</p></div>';
      return;
    }
    const scenario = scenarios[decision.scenario];
    const fields = [
      ['Scenario', scenario.name], ['Fixture ID', decision.fixtureId, 'mono'], ['Run ID', decision.runId, 'mono'],
      ['Demonstration mode', modeText(decision.influence)],
      ['Demo present fingerprint', decision.present, 'mono'], ['Demo candidate fingerprint', decision.candidates, 'mono'],
      ['History condition', decision.influence ? `History ${decision.history}` : `History ${decision.history} selected visually; ignored`],
      ['Retained-state influence', decision.influence ? 'Enabled' : 'Disabled'],
      ['Selected action', actionText(scenario, decision.selected)], ['Reference action', actionText(scenario, decision.reference)],
      ['Selection changed', decision.changed ? 'Yes' : 'No'],
      ['Replay status', decision.replayMatch === true ? 'Replay match: YES' : decision.replayMatch === false ? 'Replay match: NO' : 'Not replayed'],
      ['Local browser timestamp', decision.timestamp]
    ];
    $('record-content').innerHTML = `<div class="record-content-inner"><dl class="record-fields">${fields.map(([label, value, className]) => `<div><dt>${label}</dt><dd${className ? ` class="${className}"` : ''}>${escape(value)}</dd></div>`).join('')}</dl><div class="record-factors"><h4>Relevant retained factors</h4>${decision.influence ? factorList(scenario.histories[decision.history].factors) : '<p>None applied. Retained-state influence is disabled in the reference condition.</p>'}</div></div>`;
  }

  function renderComparison() {
    $('comparison').hidden = !state.comparisonOpen;
    $('compare-toggle').setAttribute('aria-expanded', String(state.comparisonOpen));
    if (!state.comparisonOpen) return;
    const scenario = scenarios[state.scenario];
    const card = (history) => `<article class="compare-card history-${history.toLowerCase()}"><p class="eyebrow">History ${history} <span class="demo-tag">Influence on</span></p>${factorList(scenario.histories[history].factors)}<div class="compare-result"><span class="micro">Governed result</span><div class="result-action"><span class="result-letter">${scenario.histories[history].action}</span><h4>${escape(scenario.actions[scenario.histories[history].action])}</h4></div></div></article>`;
    $('comparison').innerHTML = `<div class="compare-heading"><div><p class="eyebrow">The controlled comparison</p><h3 id="comparison-title">Same boundary. Different selection.</h3></div><p>${escape(scenario.name)}<br>History A vs History B</p></div><div class="compare-invariants"><div><span class="micro">Present condition</span><strong>SAME</strong></div><div><span class="micro">Permitted actions</span><strong>SAME</strong></div><div><span class="micro">Retained history</span><strong>DIFFERENT</strong></div></div><p class="compare-present"><strong>Present condition</strong> — ${escape(scenario.present)}</p><div class="compare-columns">${card('A')}${card('B')}</div><div class="compare-bottom"><p><span class="micro">Reference condition · influence off</span><strong>${escape(actionText(scenario, scenario.reference))}</strong></p><p><span class="micro">Material selection difference</span><strong class="material">${scenario.histories.A.action !== scenario.histories.B.action ? 'YES' : 'NO'}</strong></p></div><p class="compare-summary">Only retained history changed between the governed demonstration conditions.</p><p class="compare-caption">Both governed conditions use influence ON. The reference action is identical for either history with influence OFF.</p>`;
  }

  function render() { renderInputs(); renderResult(); renderRecord(); renderComparison(); }

  function changeInputs(update) {
    Object.assign(state, update, { decision: null });
    $('selection-announcement').textContent = 'Inputs changed. Run selection to create a new Decision Record.';
    render();
  }

  function runSelection() {
    const resolved = resolveSelection(state.scenario, state.history, state.influence);
    state.runNumber += 1;
    // Time is record metadata only. It never affects selection or replay matching.
    state.decision = { ...resolved, runId: `DEMO-RUN-${String(state.runNumber).padStart(4, '0')}`, timestamp: new Date().toLocaleString(), replayMatch: null };
    renderResult(); renderRecord();
    animate($('result-content'), 'entered');
    $('selection-announcement').textContent = `Selected action: ${actionText(scenarios[state.scenario], resolved.selected)}. ${modeText(state.influence)}.`;
  }

  function replayDecision() {
    if (!state.decision) return;
    const { scenario, history, influence } = state.decision;
    const replayed = resolveSelection(scenario, history, influence);
    state.decision.replayMatch = Object.entries(replayed).every(([key, value]) => state.decision[key] === value);
    renderResult(); renderRecord();
    animate(document.querySelector('.result-panel'), 'replayed');
    $('selection-announcement').textContent = `Replay match: ${state.decision.replayMatch ? 'YES. The same fixture result was reproduced.' : 'NO. The fixture result did not match.'}`;
  }

  let copyReset;
  async function copyEmail() {
    const address = $('email-address').textContent;
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(address); copied = true; }
    } catch { /* Continue to the local, user-triggered fallback. */ }
    if (!copied) {
      const text = document.createElement('textarea');
      text.value = address; text.setAttribute('aria-label', 'Email address to copy');
      text.style.cssText = 'position:fixed;left:-9999px;top:0;';
      document.body.appendChild(text); text.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      text.remove(); $('copy-email').focus();
    }
    clearTimeout(copyReset);
    if (copied) {
      $('copy-email').textContent = 'Email copied'; $('copy-status').textContent = 'EMAIL COPIED';
      copyReset = setTimeout(() => { $('copy-email').textContent = 'Copy email'; $('copy-status').textContent = ''; }, 3500);
    } else {
      const range = document.createRange(); range.selectNodeContents($('email-address'));
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      $('email-address').focus();
      $('copy-status').textContent = 'Email selected. Use your device’s Copy command, or copy the address above.';
    }
  }

  // Scenario tabs follow the standard roving-tabindex keyboard pattern.
  const tabs = [...document.querySelectorAll('[data-scenario]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => changeInputs({ scenario: tab.dataset.scenario, history: 'A', influence: true, comparisonOpen: false }));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); tabs[next].focus(); tabs[next].click();
    });
  });
  document.querySelectorAll('[data-history]').forEach((button) => button.addEventListener('click', () => changeInputs({ history: button.dataset.history })));
  $('influence-toggle').addEventListener('click', () => changeInputs({ influence: !state.influence }));
  $('run-selection').addEventListener('click', runSelection);
  $('replay-decision').addEventListener('click', replayDecision);
  $('compare-toggle').addEventListener('click', () => {
    state.comparisonOpen = !state.comparisonOpen; renderComparison();
    if (state.comparisonOpen) { animate($('comparison'), 'entered'); $('comparison').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }
  });
  $('copy-email').addEventListener('click', copyEmail);
  render();
})();
