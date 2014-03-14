module.exports = {
  "definitions": {
    "message": {
      "links": [
        {
          "href": "/messages",
          "method": "POST",
          "title": "send",
          "properties": {
            "to": {
              "type": "string"
            },
            "from": {
              "type": "string"
            },
            "text": {
              "type": "string"
            },
            "html": {
              "type": "string"
            },
            "cc": {
              "type": "string"
            },
            "bcc": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "o:tag": {
              "type": "string"
            },
            "o:campaign": {
              "type": "string"
            },
            "o:dkim": {
              "type": "string"
            },
            "o:deliverytime": {
              "type": "string"
            },
            "o:testmode": {
              "type": "string"
            },
            "o:tracking": {
              "type": "string"
            },
            "o:tracking-clicks": {
              "type": "string"
            },
            "o:tracking-opens": {
              "type": "string"
            }
          },
          "required": ["to", "from"]
        }
      ]
    },
    "domain": {
      "links": [
        {
          "href": "/domains",
          "method": "GET",
          "title": "list",
          "properties": {
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            }
          }
        },
        {
          "href": "/domains/{domain}",
          "method": "GET",
          "title": "info"
        },
        {
          "href": "/domains",
          "method": "POST",
          "title": "create",
          "properties": {
            "name": {
              "type": "string"
            },
            "smtp_password": {
              "type": "string"
            },
            "wildcard": {
              "type": "boolean"
            }
          },
          "required": ["name", "smtp_password"]
        },
        {
          "href": "/domains/{domain}",
          "method": "DELETE",
          "title": "delete"
        },
        {
          "href": "/domains/{domain}/credentials",
          "method": "GET",
          "title": "list",
          "properties": {
            "limit": {
              "type": "number"
            },
            "skip": {
              "type": "number"
            }
          }
        },
        {
          "href": "/domains/{domain}/credentials",
          "method": "POST",
          "title": "create",
          "properties": {
            "login": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": ["login", "password"]
        },
        {
          "href": "/domains/{domain}/credentials/{login}",
          "method": "PUT",
          "title": "update",
          "properties": {
            "password": {
              "type": "string"
            }
          },
          "required": ["password"]
        },
        {
          "href": "/domains/{domain}/credentials/{login}",
          "method": "DELETE",
          "title": "delete"
        }
      ]
    }
    /*
     "mailgox": {

     },
     "route": {
     "links": [
     ]
     },
     "list": {
     "links": [
     ]
     },
     "member": {
     "links": [
     ]
     }*/
  }
};