module.exports = {
  "definitions": {
    "message": {
      "links": [
        {
          "href": "/messages",
          "method": "POST",
          "title": "send"
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