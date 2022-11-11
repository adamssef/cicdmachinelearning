/**
 * @file
 * The OneTrust API data and categories filter, and cookie deletion.
 */

function OptanonWrapper() {

  if(drupalSettings.lgpd_onetrust_cookie_blocking.insertscript) {
    var insertscript_items = drupalSettings.lgpd_onetrust_cookie_blocking.insertscript.split(";");
    insertscript_items.forEach(function (insertscript_row) {
      insertscript = insertscript_row.split("|");
      if(insertscript[0]){
        if((typeof insertscript[3]) !== 'undefined') {
          insertscript[3] = (insertscript[3].trim() == "" ? null : insertscript[3]);
        }
        if((typeof insertscript[4]) !== 'undefined') {
          insertscript[4] = (insertscript[4].trim() == "" ? null : insertscript[4]);
        }
        Optanon.InsertScript(insertscript[0],insertscript[1], OptanonRefreshBehaviours, insertscript[4], insertscript[2] );
      }
    });
  }

  if(drupalSettings.lgpd_onetrust_cookie_blocking.inserthtml) {
    var inserthtml_items = drupalSettings.lgpd_onetrust_cookie_blocking.inserthtml.split("|");
    inserthtml_items.forEach(function (inserthtml_row) {
      inserthtml = inserthtml_row.split(",");
      if(inserthtml[0]){
        inserthtml[0] = '\'' + inserthtml[0].trim() + '\'';
        inserthtml[2] = (inserthtml[2].trim() == "" ? null : inserthtml[2]);
        inserthtml[3] = (inserthtml[3].trim() == "" ? null : inserthtml[3]);
        inserthtml[4] = drupalSettings.lgpd_onetrust_cookie_blocking.lgpd_onetrust_version == 2 ? inserthtml[4].trim() : parseInt(inserthtml[4].trim());
        Optanon.InsertHtml(inserthtml[0], inserthtml[1].trim(), inserthtml[2], inserthtml[3], inserthtml[4]);
      }
    });
  }

  lgpdDelete().assignCookie();
}

function OptanonRefreshBehaviours(  ) {
  Drupal.attachBehaviors(document, Drupal.settings);
}

var lgpdDelete = function ( name ) {

  /**
   * Get the list of disabled category ids
   */
  var getDisabledCategory = function (activegroups, cookie_category) {

    var res = activegroups.split(",");
    var disabled = [];
    cookie_category.forEach(function (c_category) {
      if (Array.isArray(res) === true) {
        if (jQuery.inArray(String(c_category), res) == -1) {
          disabled.push(c_category);
        }
      }
    });
    return disabled;
  };

  /**
   * Generate a list of cookies to delete
   */
  var getDisabledCookies = function (cookie_list, cookie_category_id, cookies_to_block) {
    if (cookie_list.length > 0) {
      if (cookie_category_id === 2) {
        cookies_to_block.performance_cookie.push(cookie_list);
      }
      else if (cookie_category_id === 3) {
        cookies_to_block.functional_cookie.push(cookie_list);
      }
      else if (cookie_category_id === 4) {
        cookies_to_block.targeting_cookie.push(cookie_list);
      }
      else if (cookie_category_id === 8) {
        cookies_to_block.media_cookie.push(cookie_list);
      }
      prepareDeleteCookie(cookie_list);
    }
  };

  /**
   * Delete the cookie from the site domain.
   */
  var prepareDeleteCookie = function (c_list) {
    c_list.forEach(function (c_names) {
      deleteCookie(c_names.Name, c_names.Host);
    });
  };

  /**
   * Delete the cookies.
   */
  var deleteCookie = function (c_name, c_host, p_domain) {
    var params = {};
    var c_path = '/';
    params["expires"] = 'Thu, 01-Jan-70 00:00:01 GMT';
    var part_domains = drupalSettings.lgpd_onetrust_cookie_blocking.base_domain.split(".");
    var last = part_domains.pop();
    var second_last = part_domains.pop();
    part_domains.push("");
    part_domains.push(second_last + "." + last);
    part_domains.push("." + second_last + "." + last);
    part_domains.push(drupalSettings.lgpd_onetrust_cookie_blocking.base_domain);
    part_domains.push("." + drupalSettings.lgpd_onetrust_cookie_blocking.base_domain);
    part_domains.push(c_host);
    part_domains.reverse();
    part_domains.forEach(function (part_domain) {
      document.cookie = c_name + "=" +
        ((c_path) ? "; path=" + c_path : "") +
        ((part_domain) ? "; domain=" + part_domain : "") +
        "; expires=" + params.expires;
    });
  };

  return {
    assignCookie : function () {

      var cookies_to_block = {performance_cookie: [], functional_cookie: [], targeting_cookie: []};
      var cookie_category = [2, 3, 4, 8];

      var disabled_cookie_category = getDisabledCategory(OptanonActiveGroups, cookie_category);

      if (typeof disabled_cookie_category !== 'undefined' && disabled_cookie_category.length > 0) {
        var domaindata = Optanon.GetDomainData();
        var domaindata_length = domaindata.Groups.length;
        var parrent_groupid = [];
        var i, j;

        //Fetch the parent category ID and cookies
        for (i = 1; i < domaindata_length; i++) {
          if (jQuery.inArray(parseInt(domaindata.Groups[i].OptanonGroupId), disabled_cookie_category) !== -1) {
            getDisabledCookies(domaindata.Groups[i].Cookies, parseInt(domaindata.Groups[i].OptanonGroupId), cookies_to_block);
            parrent_groupid.push([parseInt(domaindata.Groups[i].OptanonGroupId), parseInt(domaindata.Groups[i].GroupId)]);
            // Added for LGPD V2.
            if (domaindata.Groups[i].Hosts != null && domaindata.Groups[i].Hosts.length) {
              for (k = 0; k < domaindata.Groups[i].Hosts.length; k++) {
                getDisabledCookies(domaindata.Groups[i].Hosts[k].Cookies, parseInt(domaindata.Groups[i].OptanonGroupId), cookies_to_block);
                parrent_groupid.push([parseInt(domaindata.Groups[i].OptanonGroupId), parseInt(domaindata.Groups[i].GroupId)]);
              }
            }
          }
        }
        //Fetch the sub category cookies belonging to parent categories.
        for (j = 1; j < domaindata_length; j++) {
          if (domaindata.Groups[j].Parent !== null && domaindata.Groups[j].Parent) {
            parrent_groupid.forEach(function (p_group) {
              if (p_group[1] == domaindata.Groups[j].Parent.GroupId) {
                getDisabledCookies(domaindata.Groups[j].Cookies, p_group[0], cookies_to_block);
              }
            });
          }
        }
      }
    }
  }
};

(function ($, Drupal) {
  Drupal.behaviors.jpro_lgpd_footer_link = {
    attach: function (context) {
        $('.ot-sdk-show-settings').attr('href', 'javascript:void(0);');
    }
  };
})(jQuery, Drupal);
