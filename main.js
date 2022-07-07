(function () {
  let temp = document.querySelector("#myTemplate");
  let container = document.querySelector(".container");
  let btn = document.querySelector(".addFolder");
  let nav = document.querySelector(".navigation");
  let fid = 0;
  let cid = 0;
  let folder = [];
  btn.addEventListener("click", addFolder);
  nav.querySelector("[dir='0']").addEventListener("click", navigationToggle);
  function addFolder() {
    let fname = prompt("What's in your mind?");
    if (!!fname) {
      let elem = folder.find((f) => f.name == fname.trim() && f.pid == cid);
      if (elem) {
        alert("cannot create folder with same name");
        return;
      }
      fid++;
      folder.push({
        id: fid,
        name: fname,
        pid: parseInt(cid),
      });
      addFolderInHTMLPage(fname, fid, cid);
      preserveInLocalStorage();
    }
  }
  function deleteFolder() {
    let divFolderCopy = this.parentNode;
    let divName = divFolderCopy.querySelector("[purpose='textAdder']");
    let divId = divFolderCopy.getAttribute("fid");
    let flag = confirm("Do you want to delete the folder " + divName.innerHTML);
    if (!flag) return;
    let exists = folder.some((f) => f.pid == divId);
    if (exists) {
      alert("You cannot delete the folder.Remove the children first");
    } else {
      container.removeChild(divFolderCopy);
      let idx = folder.findIndex((f) => f.id == divId);
      folder.splice(idx, 1);
      preserveInLocalStorage();
    }
  }
  function editFolder() {
    let divFolderCopy = this.parentNode;
    let divName = divFolderCopy.querySelector("[purpose='textAdder']");
    let divId = divFolderCopy.getAttribute("fid");
    let ofname = divName.innerHTML;
    let nfname = prompt("Whats in your mind?");
    if (!nfname) return;
    else {
      if (nfname == ofname) {
      } else {
        let exists = folder
          .filter((f) => f.pid == cid)
          .some((f) => f.name == nfname);
        if (exists) {
          alert("name already exists try something new");
        } else {
          divName.innerHTML = fname;
          let obj = folder.find((f) => f.id == divId);
          obj.name = fname;
          preserveInLocalStorage();
        }
      }
    }
  }

  function navigationToggle() {
    let parentId = this.getAttribute("dir");
    container.innerHTML = "";
    cid = parseInt(parentId);
    console.log(cid);
    let fd = folder
      .filter((f) => f.pid == cid)
      .forEach((f) => addFolderInHTMLPage(f.name, f.id, f.pid));
    while (this.nextSibling) {
      nav.removeChild(this.nextSibling);
    }
  }

  function viewFolder() {
    let divFolderCopy = this.parentNode;
    let divName = divFolderCopy.querySelector("[purpose= 'textAdder']");
    let spanPath = temp.content.querySelector(".path");
    let spanPathCopy = document.importNode(spanPath, true);
    spanPathCopy.setAttribute("dir",divFolderCopy.getAttribute("fid"));
    spanPathCopy.addEventListener("click", navigationToggle);
    spanPathCopy.innerHTML = divName.innerHTML;
    nav.appendChild(spanPathCopy);

    cid = divFolderCopy.getAttribute("fid");
    container.innerHTML = "";
    let fd = folder.filter((f) => f.pid == cid);
    fd.forEach((f) => addFolderInHTMLPage(f.name, f.id, f.pid));
  }

  function addFolderInHTMLPage(fname, fid, pid) {
    let divFolder = temp.content.querySelector(".folder");
    let divFolderCopy = document.importNode(divFolder, true);
    let textSpan = divFolderCopy.querySelector("[purpose='textAdder']");
    let spanEdit = divFolderCopy.querySelector("[action='edit']");
    let spanView = divFolderCopy.querySelector("[action='view']");
    let spanDelete = divFolderCopy.querySelector("[action='delete']");
    divFolderCopy.setAttribute("fid", fid);
    divFolderCopy.setAttribute("pid", pid);
    textSpan.innerHTML = fname;
    spanEdit.addEventListener("click", editFolder);
    spanDelete.addEventListener("click", deleteFolder);
    spanView.addEventListener("click", viewFolder);

    container.appendChild(divFolderCopy);
  }
  function preserveInLocalStorage() {
    // console.log(folder);
    let fjson = JSON.stringify(folder);
    localStorage.setItem("data", fjson);
  }
  function loadFromLocalStorage() {
    let fjson = localStorage.getItem("data");
    if (!fjson) return;
    folder = JSON.parse(fjson);
    // console.log(folder);
    folder.forEach(function (f) {
      if (fid < f.id) fid = f.id;
      if (f.pid == cid) {
        addFolderInHTMLPage(f.name, f.id, cid);
      }
    });
  }
  loadFromLocalStorage();
})();
