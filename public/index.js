let apis = [];
let apisProject = [];
let apisUser = [];
let apisTemplate = [];

let methods = {
  get: "success",
  post: "warning",
  patch: "secondary",
  delete: "danger",
  put: "primary",
};

class APIEndpoint {
  _method = "";
  _url = "";
  _iobj = null;
  _oobj = null;
  _decsription = "";
  _oobjDesc = "";
  _iobjDesc = "";
  _urlDesc = "";
  _grp = "";
  _done = false;
  done = () => {
    this._done = true;
    return this;
  };
  grp = (_grp) => {
    this._grp = _grp;
    return this;
  };

  method = (_method) => {
    this._method = _method;
    return this;
  };
  url = (_url) => {
    this._url = _url;
    return this;
  };
  inObj = (_iobj) => {
    this._iobj = _iobj;
    return this;
  };
  outObj = (_oobj) => {
    this._oobj = _oobj;
    return this;
  };
  description = (_desc) => {
    this._decsription = _desc;
    return this;
  };

  add = () => {
    apis.push(this);
  };
  outDesc = (_oobjDesc) => {
    this._oobjDesc = _oobjDesc;
    return this;
  };
  inDesc = (_iobjDesc) => {
    this._iobjDesc = _iobjDesc;
    return this;
  };
  urlDesc = (_urlDesc) => {
    this._urlDesc = _urlDesc;
    return this;
  };
}

function generateCodeMarkup(obj, indentLevel = 0) {
  const indent = "&nbsp;&nbsp;".repeat(indentLevel);
  let html = '<pre class="code m-0 p-0"><code>';

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      console.log("Taadet");
      html += indent + "[]";
    } else {
      html += indent + "[";
      if (obj.length > 0) {
        html += "<br>";
        obj.forEach((item, index, array) => {
          html += generateCodeMarkup(item, indentLevel + 1);
          if (index !== array.length - 1) {
            html += ",<br>";
          }
        });
        html += indent;
      }
      html += "]";
    }
  } else if (typeof obj === "object" && obj !== null) {
    html += indent + "{<br>";
    const keys = Object.keys(obj);
    keys.forEach((key, index) => {
      const value = obj[key];
      html +=
        indent + '&nbsp;&nbsp;<span class="property">' + key + "</span>: ";
      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            html += "[]";
          } else {
            html += generateCodeMarkup(value, indentLevel + 1);
          }
        } else if (Object.keys(value).length === 0) {
          html += '<span class="null">undefined</span>';
        } else {
          html += generateCodeMarkup(value, indentLevel + 1);
        }
      } else if (typeof value === "string") {
        html += '<span class="string">"' + value + '"</span>';
      } else if (typeof value === "number") {
        html += '<span class="number">' + value + "</span>";
      } else if (typeof value === "boolean") {
        html += '<span class="boolean">' + value + "</span>";
      } else if (value === null) {
        html += '<span class="null">null</span>';
      } else if (value === undefined) {
        html += '<span class="null">undefined</span>';
      }
      if (index !== keys.length - 1) {
        html += ",<br>";
      } else {
        html += "<br>";
      }
    });
    html += indent + "}";
  } else {
    html += JSON.stringify(obj);
  }

  html += "</code></pre>";
  return html;
}

function loadUser() {
  new APIEndpoint()
    .done()
    .method("post")
    .url("/auth/login")
    .urlDesc("Allows users to enter their credentials in order to login")
    .inDesc(
      "The request body should contain the email and the password of the user as given below.",
    )
    .inObj({
      email: "email.example@gmail.com",
      password: "MyPasswordIs0xDeadBeef",
    })
    .outDesc(
      "As a return get the authorization token (Bearer Token) to use for further requests: must be used in the Authorization header in the request to the routes that require authentication.",
    )
    .outObj({
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcwNjgyMTMzMjM5OCwiaWF0IjoxNjMzNzYwNzIzfQ.7",
    })
    .add();
  new APIEndpoint()
    .done()
    .method("post")
    .url("/auth/register")
    .urlDesc(
      "Allows visitors to create a new account, once entered all necessary information",
    )
    .inDesc(
      "The request body should contain the email, the password, the first name and the last name of the user as given below. (*) Note that Phone, and Address fields are not required, but optional",
    )
    .inObj({
      email: "john.doe@gmail",
      password: "0xDeadBeef",
      name: "John",
      lastName: "Doe",
      phone: "+123 45 678 910",
      city: "Tunis",
      street: "Centre Urbain Nord",
      postalCode: 1002,
    })
    .outDesc(
      "The response is the same as for login. the authorization token (Bearer Token) to use for further requests.",
    )
    .outObj({
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcwNjgyMTMzMjM5OCwiaWF0IjoxNjMzNzYwNzIzfQ.7",
    })
    .add();

  new APIEndpoint()
    .done()
    .method("get")
    .url("/users/infos")
    .urlDesc("Returns all users infos")
    .outDesc("The Result should be all the users infos")
    .outObj({
      email: "omar.mejdi@insat.com",
      name: "omar",
      lastName: "mejdi",
      isApproved: false,
      role: "user",
      products: [],
      id: "665292e125aec2506e246201",
    })
    .add();
  apisUser = [...apis];
  apis = [];
}

function loadTemplates() {
  apisTemplate = [...apis];
  apis = [];
}

function getIdFrom(api) {
  return (
    api._method +
    "-" +
    api._url.split("/").join("-").split("{").join("-").split("}").join("")
  );
}

function insertAll(elemId) {
  let cont = document.getElementById(elemId);
  apis.forEach((api) => {
    let elem = getCard(api);

    cont.innerHTML += elem;
  });
}

function insertAllDomains() {
  apis = [...apisUser];
  insertAll("api-container-user");
  apis = [...apisTemplate];
  insertAll("api-container-template");
}

/**
 *
 * @param api : APIEndpoint
 * @param isInput : boolean
 * @return {string}
 */
function getIOJSON(api, isInput) {
  let descriptionPart = "";
  let objPart = "";
  let desc, obj;
  if (isInput) {
    obj = api._iobj;
    desc = api._iobjDesc;
  } else {
    obj = api._oobj;
    desc = api._oobjDesc;
  }
  if (!obj && !desc) return "";
  if (obj) {
    objPart = `<div>${generateCodeMarkup(obj)}</div>`;
  }
  let boga;
  if (isInput)
    boga =
      "<hr class=\"m-1\"><p class='d-inline-block card m-1 mt-2' style='background-color: bisque; color:#27ae60'>Request</p> <br>";
  else
    boga =
      "<hr class=\"m-1\"><p class='d-inline-block card m-1 mt-2' style='background-color: bisque; color:crimson'>Response</p> <br>";

  descriptionPart = `<div> ${boga} ${desc} </div> `;
  return descriptionPart + objPart;
}

function formatEndPoint(api) {
  let urlString = api._url;
  let newParts;
  if (urlString.includes("{")) {
    // surround it with spans indicatinng its params, the span class is parametri
    let parts = urlString.split("/");
    newParts = parts.map((part) => {
      if (part.includes("{")) {
        return `<span class="parametri">${part}</span>`;
      } else {
        return part;
      }
    });
    urlString = newParts.join("/");
  }

  return urlString;
}

/**
 *
 * @param api : APIEndpoint
 * @return {string}
 */
function getCard(api) {
  let color = methods[api._method];
  let moreColor = api._done ? "dark" : "outline-dark";
  return `
    <div class="container mt-4 custom-padding"> 
        <div class="card custom-padding custom-margin ">
            <div class="card-header p-1 d-flex flex-wrap justify-content-between">
                <div class="btn btn-${color} disabled align-self-start">${api._method.toUpperCase()}</div>
                <span class="mx-3 align-self-start">${formatEndPoint(api)}</span>
                <div class="btn btn-${moreColor} ml-auto collapsed " 
                    type="button" data-bs-toggle="collapse" data-bs-target="#${getIdFrom(api)}" 
                    aria-expanded="false" aria-controls="collapseExample">
                    More...
                </div>
            </div>
            <div class="card-body p-2">
                
                ${api._urlDesc ? "<div>" + api._urlDesc + "</div>" : ""}
                <div class="my-1 p-2 collapse" id="${getIdFrom(api)}" style="">
                    
                    ${api._decsription ? "<div id='baah'><hr>" + api._decsription + "</div>" : ""}
                    ${getIOJSON(api, true)}
                    ${getIOJSON(api, false)}
                </div>
            </div>
        </div>
    </div>`;
}

loadUser();
loadTemplates();
insertAllDomains();
