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
         "title": "list"
       },
       {
         "href": "/domains/{domain}",
         "method": "GET",
         "title": "info"
       },
       {
         "href": "/domains",
         "method": "POST",
         "title": "create"
       },
       {
         "href": "/domains",
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