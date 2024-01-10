const generateDOM = (thread, posts) => {
    const container = document.createElement('article');

    const heading = document.createElement('h1');
    heading.textContent = thread.title ?? '';

    const messages = document.createElement('ol');
    const replies = {};
    const cites = {};
    for (const post of posts) {
        const item = document.createElement('li');

        const message = document.createElement('article');
        message.id = 'p' + post.id;

        let body;
        if (post.content !== undefined) {
            body = document.createElement('p');
            body.innerHTML = post.content;

            for (const quoteLink of body.querySelectorAll('a.quotelink[href^="#p"]')) {
                const quoteId = quoteLink.getAttribute('href').substring(2);
                if (replies[quoteId] === undefined) replies[quoteId] = new Set();
                replies[quoteId].add(post.id);
            }
        }

        const info = document.createElement('cite');
        cites[post.id] = info;

        const author = document.createElement('address');
        author.textContent = post.author.name;
        if (post.author.trip !== undefined) author.setAttribute('data-trip', post.author.trip);

        const timestamp = document.createElement('time');
        const date = new Date(post.time * 1000);
        const dateISO = date.toISOString()
        timestamp.textContent = date.toLocaleString();
        timestamp.setAttribute('datetime', dateISO);
        timestamp.title = dateISO;

        const anchor = document.createElement('a');
        anchor.textContent = post.id;
        anchor.rel = 'author';
        anchor.href = '#p' + post.id;

        let file;
        if (post.file !== undefined) {
            file = document.createElement('span');
            file.className = 'file';
            file.textContent = post.file.name;
        }

        info.appendChild(author);
        info.appendChild(timestamp);
        info.appendChild(anchor);
        message.appendChild(info);
        if (post.file !== undefined) message.appendChild(file);
        if (post.content !== undefined) message.appendChild(body);
        item.appendChild(message);
        messages.appendChild(item);
    }

    for (const [ id, replyIds ] of Object.entries(replies)) {
        const citations = document.createElement('ol');
        for (const replyId of replyIds) {
            const item = document.createElement('li');
            const citation = document.createElement('a');
            citation.textContent = '>>' + replyId;
            citation.href = '#p' + replyId;

            item.appendChild(citation);
            citations.appendChild(item);
        }
        cites[id].appendChild(citations);
    }

    if (thread.title !== undefined) {
        const subject = document.createElement('span');
        subject.className = 'subject';
        subject.textContent = thread.title;

        const cite = cites[posts[0].id];
        cite.parentNode.insertBefore(subject, cite);
    }

    container.appendChild(messages);

    return container;
}
