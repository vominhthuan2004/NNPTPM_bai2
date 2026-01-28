const API = "http://localhost:3000/posts";
const API_COMMENTS = "http://localhost:3000/comments";

// ================= LOAD POSTS =================
async function LoadData() {
    let res = await fetch(API);
    let posts = await res.json();
    let body = document.getElementById("body_table");
    body.innerHTML = '';

    for (const post of posts) {
        let style = post.isDeleted
            ? "text-decoration: line-through; color: gray;"
            : "";

        body.innerHTML += `<tr style="${style}">
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.views}</td>
            <td>
                <input type="button" value="Edit" onclick="EditPost('${post.id}')"/>
                <input type="submit" value="Delete" onclick="SoftDelete('${post.id}')"/>
            </td>
        </tr>`;
    }
}

// ================= LOAD COMMENTS =================
async function LoadComments() {
    let res = await fetch(API_COMMENTS);
    let comments = await res.json();
    let body = document.getElementById("comments_table");
    body.innerHTML = '';

    for (const comment of comments) {
        let style = comment.isDeleted
            ? "text-decoration: line-through; color: gray;"
            : "";

        body.innerHTML += `<tr style="${style}">
            <td>${comment.id}</td>
            <td>${comment.text}</td>
            <td>${comment.postId}</td>
            <td>
                <input type="button" value="Edit" onclick="EditComment('${comment.id}')"/>
                <input type="button" value="Delete" onclick="SoftDeleteComment('${comment.id}')"/>
            </td>
        </tr>`;
    }
}

// ================= EDIT POST =================
async function EditPost(id) {
    let res = await fetch(API + "/" + id);
    let post = await res.json();
    document.getElementById("id_txt").value = post.id;
    document.getElementById("title_txt").value = post.title;
    document.getElementById("view_txt").value = post.views;
}

// ================= CLEAR FORM =================
function ClearForm() {
    document.getElementById("id_txt").value = '';
    document.getElementById("title_txt").value = '';
    document.getElementById("view_txt").value = '';
}

// ================= SAVE POST =================
async function Save() {
    let id = document.getElementById("id_txt").value; // dùng để UPDATE
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;

    // -------- UPDATE --------
    if (id) {
        await fetch(API + "/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                views: views
            })
        });

        LoadData();
        return false;
    }

    // -------- CREATE (ID tự tăng) --------
    let resAll = await fetch(API);
    let posts = await resAll.json();

    let maxId = posts.length > 0
        ? Math.max(...posts.map(p => Number(p.id)))
        : 0;

    let newId = String(maxId + 1);

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: newId,
            title: title,
            views: views,
            isDeleted: false
        })
    });

    LoadData();
    return false;
}

// ================= SOFT DELETE =================
async function SoftDelete(id) {
    let res = await fetch(API + "/" + id);
    let post = await res.json();
    
    await fetch(API + "/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            isDeleted: !post.isDeleted
        })
    });

    LoadData();
    return false;
}

// ================= EDIT COMMENT =================
async function EditComment(id) {
    let res = await fetch(API_COMMENTS + "/" + id);
    let comment = await res.json();
    document.getElementById("comment_id_txt").value = comment.id;
    document.getElementById("comment_text_txt").value = comment.text;
    document.getElementById("comment_postId_txt").value = comment.postId;
}

// ================= CLEAR COMMENT FORM =================
function ClearCommentForm() {
    document.getElementById("comment_id_txt").value = '';
    document.getElementById("comment_text_txt").value = '';
    document.getElementById("comment_postId_txt").value = '';
}

// ================= SAVE COMMENT =================
async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value;
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_postId_txt").value;

    if (!text || !postId) {
        alert('Vui lòng điền đầy đủ thông tin');
        return false;
    }

    // -------- UPDATE --------
    if (id) {
        await fetch(API_COMMENTS + "/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: text,
                postId: postId
            })
        });

        ClearCommentForm();
        LoadComments();
        return false;
    }

    // -------- CREATE (ID tự tăng) --------
    let resAll = await fetch(API_COMMENTS);
    let comments = await resAll.json();

    let maxId = comments.length > 0
        ? Math.max(...comments.map(c => Number(c.id)))
        : 0;

    let newId = String(maxId + 1);

    await fetch(API_COMMENTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: newId,
            text: text,
            postId: postId,
            isDeleted: false
        })
    });

    ClearCommentForm();
    LoadComments();
    return false;
}

// ================= SOFT DELETE COMMENT =================
async function SoftDeleteComment(id) {
    let res = await fetch(API_COMMENTS + "/" + id);
    let comment = await res.json();
    
    await fetch(API_COMMENTS + "/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            isDeleted: !comment.isDeleted
        })
    });

    LoadComments();
    return false;
}

// ================= INIT =================
LoadData();
LoadComments();
