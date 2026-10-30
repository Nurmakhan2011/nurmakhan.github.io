// Все обращения ниже вымышлены и созданы только для демонстрации интерфейса.
const tickets = [
  {
    id: 'GM-2048',
    kind: 'complaint',
    title: 'Помехи во время RP-сцены',
    player: 'Игрок 1042',
    reported: 'Игрок 7710',
    time: '2 мин назад',
    status: 'open',
    statusLabel: 'Новая',
    messages: [
      {
        role: 'Игрок',
        time: '14:32',
        text: 'Во время сцены другой участник несколько раз мешал отыгрышу и провоцировал конфликт. Прошу проверить ситуацию.'
      },
      {
        role: 'Обвиняемый',
        time: '14:35',
        text: 'Я не хотел мешать, всё произошло случайно.'
      }
    ],
    summary: 'В обращении описан возможный срыв RP-сцены. Для вывода нужно сопоставить объяснения участников с пунктом правил и доступными материалами.',
    category: 'Нарушение RP',
    rule: 'Проверить правила RP',
    confidence: 'Средняя',
    recommendation: 'Запросить материалы'
  },
  {
    id: 'GM-2047',
    kind: 'report',
    title: 'Не открывается дверь здания',
    player: 'Игрок 2381',
    reported: '—',
    time: '8 мин назад',
    status: 'review',
    statusLabel: 'На проверке',
    messages: [
      {
        role: 'Игрок',
        time: '14:19',
        text: 'Не получается войти в здание у центральной площади. Перезапуск не помог.'
      }
    ],
    summary: 'Похоже на техническую проблему с объектом или входом. В обращении не указаны устройство и точное место на карте.',
    category: 'Техническая проблема',
    rule: 'Не требуется',
    confidence: 'Высокая',
    recommendation: 'Уточнить детали'
  },
  {
    id: 'GM-2046',
    kind: 'complaint',
    title: 'Оскорбления в общем чате',
    player: 'Игрок 6503',
    reported: 'Игрок 4119',
    time: '21 мин назад',
    status: 'open',
    statusLabel: 'Новая',
    messages: [
      {
        role: 'Игрок',
        time: '14:06',
        text: 'Участник написал несколько оскорбительных сообщений в общем чате. Пожалуйста, проверьте чат.'
      }
    ],
    summary: 'Жалоба касается общения в чате. Для решения важно проверить контекст переписки и применимый пункт правил.',
    category: 'Нарушение общения',
    rule: 'Проверить правила чата',
    confidence: 'Средняя',
    recommendation: 'Проверить переписку'
  },
  {
    id: 'GM-2045',
    kind: 'report',
    title: 'Вопрос по игровому заданию',
    player: 'Игрок 9055',
    reported: '—',
    time: '36 мин назад',
    status: 'done',
    statusLabel: 'Решено',
    messages: [
      {
        role: 'Игрок',
        time: '13:51',
        text: 'Подскажите, где найти начало задания «Городские истории»?'
      },
      {
        role: 'Администратор',
        time: '13:57',
        text: 'Начните с отметки задания на карте. Если она не появилась, перезайдите в игру и проверьте раздел заданий.'
      }
    ],
    summary: 'Вопрос по прохождению. Ответ администратора содержит базовую инструкцию и шаг для устранения возможного сбоя.',
    category: 'Игровой вопрос',
    rule: 'Не требуется',
    confidence: 'Высокая',
    recommendation: 'Ответить по шаблону'
  },
  {
    id: 'GM-2044',
    kind: 'complaint',
    title: 'Подозрение на нечестную игру',
    player: 'Игрок 3328',
    reported: 'Игрок 8206',
    time: '1 ч назад',
    status: 'review',
    statusLabel: 'На проверке',
    messages: [
      {
        role: 'Игрок',
        time: '13:10',
        text: 'Кажется, другой игрок перемещался слишком быстро. Прошу проверить, возможно, это ошибка.'
      },
      {
        role: 'Обвиняемый',
        time: '13:14',
        text: 'У меня был высокий пинг, персонаж мог отображаться некорректно.'
      }
    ],
    summary: 'Описание само по себе не подтверждает нарушение. Перед выводом требуется проверка игровых данных ответственным специалистом.',
    category: 'Подозрение на чит',
    rule: 'Требуется проверка',
    confidence: 'Низкая',
    recommendation: 'Передать на проверку'
  }
];

const state = {
  filter: 'all',
  query: '',
  selectedId: tickets[0].id,
  newestFirst: true
};

const $ = selector => document.querySelector(selector);

const escapeHtml = value =>
  String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

function visibleTickets() {
  const query = state.query.trim().toLocaleLowerCase('ru');

  return tickets
    .filter(ticket => {
      const matchesFilter = state.filter === 'all' || ticket.kind === state.filter;
      const searchable = [
        ticket.id,
        ticket.title,
        ticket.player,
        ticket.reported,
        ticket.category
      ].join(' ').toLocaleLowerCase('ru');

      return matchesFilter && (!query || searchable.includes(query));
    })
    .sort((a, b) => {
      const order = tickets.indexOf(a) - tickets.indexOf(b);
      return state.newestFirst ? order : -order;
    });
}

function plural(number, one, few, many) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) return one;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) return few;
  return many;
}

function renderList() {
  const filtered = visibleTickets();

  $('#ticketList').innerHTML = filtered.map(ticket => `
    <button class="ticket-card ${ticket.id === state.selectedId ? 'selected' : ''}"
      data-id="${escapeHtml(ticket.id)}"
      aria-pressed="${ticket.id === state.selectedId}">
      <div class="ticket-top">
        <span class="ticket-type ${ticket.kind}">
          ${ticket.kind === 'complaint' ? 'ЖАЛОБА' : 'ИГРОВОЙ РЕПОРТ'}
        </span>
        <span class="ticket-time">${escapeHtml(ticket.time)}</span>
      </div>
      <p class="ticket-title">${escapeHtml(ticket.title)}</p>
      <div class="ticket-bottom">
        <span>${escapeHtml(ticket.player)} · ${escapeHtml(ticket.id)}</span>
        <span class="ticket-status ${ticket.status}">${escapeHtml(ticket.statusLabel)}</span>
      </div>
    </button>
  `).join('');

  $('#emptyState').hidden = filtered.length !== 0;
  $('#resultCount').textContent =
    `${filtered.length} ${plural(filtered.length, 'обращение', 'обращения', 'обращений')}`;
  $('#countAll').textContent = tickets.length;

  $('#statOpen').textContent = tickets.filter(ticket => ticket.status !== 'done').length;
  $('#statComplaints').textContent = tickets.filter(ticket => ticket.kind === 'complaint').length;
  $('#statReports').textContent = tickets.filter(ticket => ticket.kind === 'report').length;

  $('#ticketList').querySelectorAll('.ticket-card').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedId = button.dataset.id;
      render();
    });
  });
}

function renderDetail() {
  const ticket = tickets.find(item => item.id === state.selectedId);

  if (!ticket) {
    $('#detailPanel').innerHTML = '<div class="empty-state"><strong>Выберите обращение</strong></div>';
    return;
  }

  const messages = ticket.messages.map(message => {
    let roleClass = '';

    if (message.role === 'Игрок') roleClass = 'from-player';
    if (message.role === 'Администратор') roleClass = 'from-admin';

    return `
      <div class="message ${roleClass}">
        <div class="message-head">
          <span class="avatar small">${escapeHtml(message.role[0])}</span>
          <span>${escapeHtml(message.role)}</span>
          <time>${escapeHtml(message.time)}</time>
        </div>
        <div class="message-bubble">${escapeHtml(message.text)}</div>
      </div>
    `;
  }).join('');

  const reply = ticket.kind === 'complaint'
    ? 'Здравствуйте! Спасибо за обращение. Мы проверим описанную ситуацию и материалы. Решение сообщим после проверки.'
    : `Здравствуйте! Спасибо за сообщение. ${
      ticket.category === 'Техническая проблема'
        ? 'Уточните, пожалуйста, устройство и точное место на карте.'
        : 'Мы проверим информацию и постараемся помочь.'
    }`;

  $('#detailPanel').innerHTML = `
    <div class="detail-heading">
      <div>
        <span class="ticket-type ${ticket.kind}">
          ${ticket.kind === 'complaint' ? 'ЖАЛОБА НА ИГРОКА' : 'ИГРОВОЙ РЕПОРТ'}
        </span>
        <h2>${escapeHtml(ticket.title)}</h2>
        <div class="detail-meta">
          ${escapeHtml(ticket.id)} &nbsp;·&nbsp;
          ${escapeHtml(ticket.player)} &nbsp;·&nbsp;
          ${escapeHtml(ticket.time)}
        </div>
      </div>
      <button class="icon-button" id="moreButton" aria-label="Дополнительные действия">···</button>
    </div>

    <p class="conversation-label">История переписки</p>
    <div>${messages}</div>

    <section class="analysis">
      <div class="analysis-head">
        <strong>Подсказка помощника</strong>
        <span class="ai-tag">ДЕМО · НЕ ВЕРДИКТ</span>
      </div>
      <p>${escapeHtml(ticket.summary)}</p>
      <div class="analysis-grid">
        <div class="analysis-cell">
          <span>Предполагаемая категория</span>
          <strong>${escapeHtml(ticket.category)}</strong>
        </div>
        <div class="analysis-cell">
          <span>Уверенность подсказки</span>
          <strong class="${ticket.confidence === 'Высокая' ? 'success' : 'warning'}">
            ${escapeHtml(ticket.confidence)}
          </strong>
        </div>
        <div class="analysis-cell">
          <span>Правило</span>
          <strong>${escapeHtml(ticket.rule)}</strong>
        </div>
        <div class="analysis-cell">
          <span>Следующий шаг</span>
          <strong>${escapeHtml(ticket.recommendation)}</strong>
        </div>
      </div>
    </section>

    <div class="detail-actions">
      <button class="action-button" id="copySummary">Копировать сводку</button>
      <button class="action-button accept" id="markDone">
        ${ticket.status === 'done' ? 'Отметить открытым' : 'Отметить решённым'}
      </button>
    </div>

    <div class="reply-box">
      <label for="replyText">Черновик ответа игроку · перед отправкой проверьте текст</label>
      <textarea id="replyText">${escapeHtml(reply)}</textarea>
      <div class="reply-controls">
        <span>Черновик можно изменить</span>
        <button class="primary-button" id="copyReply">Копировать ответ</button>
      </div>
    </div>
  `;

  $('#copySummary').addEventListener('click', () => {
    const summary = [
      `${ticket.id} — ${ticket.title}`,
      ticket.summary,
      `Категория: ${ticket.category}`,
      `Следующий шаг: ${ticket.recommendation}`
    ].join('\n');

    copyText(summary, 'Сводка скопирована');
  });

  $('#copyReply').addEventListener('click', () => {
    copyText($('#replyText').value, 'Черновик ответа скопирован');
  });

  $('#markDone').addEventListener('click', () => {
    ticket.status = ticket.status === 'done' ? 'open' : 'done';
    ticket.statusLabel = ticket.status === 'done' ? 'Решено' : 'Новая';
    render();
    notify(ticket.status === 'done'
      ? 'Обращение отмечено решённым'
      : 'Обращение возвращено в очередь');
  });

  $('#moreButton').addEventListener('click', () => {
    notify('Дополнительные действия появятся в следующей версии');
  });
}

function render() {
  renderList();
  renderDetail();
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  notify(message);
}

let toastTimer;

function notify(message) {
  document.querySelector('.toast')?.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.append(toast);

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 2600);
}

$('#searchInput').addEventListener('input', event => {
  state.query = event.target.value;
  renderList();
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    state.filter = button.dataset.filter;

    document.querySelectorAll('.filter').forEach(item => {
      item.classList.toggle('active', item === button);
    });

    renderList();
  });
});

$('#sortButton').addEventListener('click', () => {
  state.newestFirst = !state.newestFirst;
  $('#sortButton').innerHTML = state.newestFirst
    ? 'Сначала новые <span>⌄</span>'
    : 'Сначала старые <span>⌃</span>';
  renderList();
});

$('#newTicketButton').addEventListener('click', () => {
  notify('Создание новых обращений доступно в полной версии');
});

render();
