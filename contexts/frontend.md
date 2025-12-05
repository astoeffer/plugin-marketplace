# Frontend / UI Development Context

> Chatbot widgets, iframes, accessible UI patterns

## Chatbot Widget Structure

```html
<div id="chatbot-container" role="complementary" aria-label="Chat assistant">
    <!-- Status announcements (screen readers) -->
    <div aria-live="polite" aria-atomic="true" id="chat-status" class="sr-only"></div>

    <!-- Message history -->
    <div id="messages" role="log" aria-label="Chat messages" tabindex="0">
        <!-- Messages rendered here -->
    </div>

    <!-- Input area -->
    <form id="chat-form" aria-label="Send message">
        <label for="chat-input" class="sr-only">Type your message</label>
        <input type="text"
               id="chat-input"
               placeholder="Type a message..."
               aria-describedby="chat-hint">
        <span id="chat-hint" class="sr-only">Press Enter to send</span>

        <button type="submit" aria-label="Send message">
            <i class="fa fa-send" aria-hidden="true"></i>
        </button>
    </form>
</div>
```

## Focus Management

```javascript
const chatbot = {
    open() {
        this.container.classList.add('open');
        this.input.focus();
        this.announce('Chat opened');
    },

    close() {
        this.container.classList.remove('open');
        this.triggerButton.focus();
        this.announce('Chat closed');
    },

    announce(message) {
        this.statusRegion.textContent = message;
    },

    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.close();
        }
    },

    addMessage(message, isUser) {
        const msg = this.createMessageElement(message, isUser);
        this.messagesContainer.appendChild(msg);
        this.announce(isUser ? 'Message sent' : 'New response received');
        msg.scrollIntoView({ behavior: 'smooth' });
    }
};
```

## iframe Integration

```html
<!-- Parent page -->
<button id="open-chat" aria-expanded="false" aria-controls="chat-frame">
    Open Chat
</button>

<iframe
    id="chat-frame"
    src="/chatbot/embed"
    title="AI Chat Assistant"
    aria-hidden="true"
    tabindex="-1">
</iframe>

<script>
const openBtn = document.getElementById('open-chat');
const frame = document.getElementById('chat-frame');

openBtn.addEventListener('click', () => {
    const isOpen = frame.getAttribute('aria-hidden') === 'false';
    frame.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    frame.tabIndex = isOpen ? -1 : 0;
    openBtn.setAttribute('aria-expanded', !isOpen);

    if (!isOpen) {
        frame.focus();
        frame.contentWindow.postMessage({ type: 'focus-input' }, '*');
    }
});
</script>
```

## Message Component

```javascript
function createMessage(text, role) {
    const msg = document.createElement('div');
    msg.className = `message message-${role}`;
    msg.setAttribute('role', 'article');
    msg.setAttribute('aria-label', `${role === 'user' ? 'You' : 'Assistant'} said`);

    const content = document.createElement('p');
    content.textContent = text;
    msg.appendChild(content);

    const time = document.createElement('time');
    time.textContent = new Date().toLocaleTimeString();
    time.setAttribute('aria-label', `Sent at ${time.textContent}`);
    msg.appendChild(time);

    return msg;
}
```

## Loading States

```html
<!-- Typing indicator -->
<div class="typing-indicator" role="status" aria-label="Assistant is typing">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
</div>

<!-- Loading state -->
<div role="status" aria-live="polite">
    <span class="sr-only">Loading response...</span>
    <div class="spinner" aria-hidden="true"></div>
</div>
```

## Error Handling

```javascript
function handleError(error) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.setAttribute('role', 'alert');
    errorMsg.innerHTML = `
        <i class="fa fa-warning" aria-hidden="true"></i>
        <span>Unable to send message. Please try again.</span>
        <button onclick="retryLastMessage()" aria-label="Retry sending message">
            Retry
        </button>
    `;
    messagesContainer.appendChild(errorMsg);
}
```

## CSS Essentials

```css
/* Screen reader only (accessible but hidden) */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

/* Focus visible */
:focus-visible {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}

/* High contrast mode */
@media (prefers-contrast: high) {
    .message {
        border: 2px solid currentColor;
    }
}
```

## Moodle Integration

```javascript
// AMD module for Moodle
define(['jquery', 'core/ajax', 'core/notification'], function($, ajax, notification) {
    return {
        init: function(config) {
            this.courseid = config.courseid;
            this.setupChat();
        },

        sendMessage: function(message) {
            return ajax.call([{
                methodname: 'local_chatbot_send_message',
                args: {
                    courseid: this.courseid,
                    message: message
                }
            }])[0];
        },

        handleResponse: function(response) {
            if (response.error) {
                notification.exception(response);
                return;
            }
            this.addMessage(response.message, 'assistant');
        }
    };
});
```

## Testing Checklist

- [ ] Keyboard: Tab through all elements
- [ ] Escape closes chat/modal
- [ ] Focus trapped in modal when open
- [ ] Focus returns to trigger on close
- [ ] Screen reader announces messages
- [ ] Loading states announced
- [ ] Error states announced
- [ ] Works at 200% zoom
