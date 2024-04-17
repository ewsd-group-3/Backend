import prisma from '../../prisma';
import { commentEmail } from '../../types/response';

const commentTemplate = async (data: commentEmail) => {
  const staff = await prisma.staff.findUnique({ where: { id: data.comment.staffId } });

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG />
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" />
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <!--<![endif]-->
      <title></title>
  
      <style type="text/css">
        @media only screen and (min-width: 660px) {
          .u-row {
            width: 640px !important;
          }
          .u-row .u-col {
            vertical-align: top;
          }
  
          .u-row .u-col-100 {
            width: 640px !important;
          }
        }
  
        @media (max-width: 660px) {
          .u-row-container {
            max-width: 100% !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
          }
          .u-row .u-col {
            min-width: 320px !important;
            max-width: 100% !important;
            display: block !important;
          }
          .u-row {
            width: 100% !important;
          }
          .u-col {
            width: 100% !important;
          }
          .u-col > div {
            margin: 0 auto;
          }
        }
        body {
          margin: 0;
          padding: 0;
        }
  
        table,
        tr,
        td {
          vertical-align: top;
          border-collapse: collapse;
        }
  
        p {
          margin: 0;
        }
  
        .ie-container table,
        .mso-container table {
          table-layout: fixed;
        }
  
        * {
          line-height: inherit;
        }
  
        a[x-apple-data-detectors='true'] {
          color: inherit !important;
          text-decoration: none !important;
        }
  
        table,
        td {
          color: #000000;
        }
      </style>
    </head>
  
    <body class="clean-body u_body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #ced4d9; color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table
        style="
          border-collapse: collapse;
          table-layout: fixed;
          border-spacing: 0;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          vertical-align: top;
          min-width: 320px;
          margin: 0 auto;
          background-color: #ced4d9;
          width: 100%;
        "
        cellpadding="0"
        cellspacing="0"
      >
        <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word; border-collapse: collapse !important; vertical-align: top">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ced4d9;"><![endif]-->
  
              <div class="u-row-container" style="padding: 0px; background-color: transparent">
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 640px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: transparent;
                  "
                >
                  <div style="border-collapse: collapse; display: table; width: 100%; height: 100%; background-color: transparent">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px;"><tr style="background-color: transparent;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color: #ffffff;width: 640px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div class="u-col u-col-100" style="max-width: 320px; min-width: 640px; display: table-cell; vertical-align: top">
                      <div style="background-color: #ffffff; height: 100%; width: 100% !important">
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            box-sizing: border-box;
                            height: 100%;
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                          "
                        ><!--<![endif]-->
                          <table
                            style="font-family: arial, helvetica, sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="overflow-wrap: break-word; word-break: break-word; padding: 0px; font-family: arial, helvetica, sans-serif"
                                  align="left"
                                >
                                  <table
                                    height="0px"
                                    align="center"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    style="
                                      border-collapse: collapse;
                                      table-layout: fixed;
                                      border-spacing: 0;
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      vertical-align: top;
                                      border-top: 1px solid #bbbbbb;
                                      -ms-text-size-adjust: 100%;
                                      -webkit-text-size-adjust: 100%;
                                    "
                                  >
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td
                                          style="
                                            word-break: break-word;
                                            border-collapse: collapse !important;
                                            vertical-align: top;
                                            font-size: 0px;
                                            line-height: 0px;
                                            mso-line-height-rule: exactly;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <span>&#160;</span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <div class="u-row-container" style="padding: 0px; background-color: transparent">
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 640px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: transparent;
                  "
                >
                  <div style="border-collapse: collapse; display: table; width: 100%; height: 100%; background-color: transparent">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px;"><tr style="background-color: transparent;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color: #ffffff;width: 640px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                    <div class="u-col u-col-100" style="max-width: 320px; min-width: 640px; display: table-cell; vertical-align: top">
                      <div
                        style="
                          background-color: #ffffff;
                          height: 100%;
                          width: 100% !important;
                          border-radius: 0px;
                          -webkit-border-radius: 0px;
                          -moz-border-radius: 0px;
                        "
                      >
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            box-sizing: border-box;
                            height: 100%;
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                            border-radius: 0px;
                            -webkit-border-radius: 0px;
                            -moz-border-radius: 0px;
                          "
                        ><!--<![endif]-->
                          <table
                            style="font-family: arial, helvetica, sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="overflow-wrap: break-word; word-break: break-word; padding: 0px; font-family: arial, helvetica, sans-serif"
                                  align="left"
                                >
                                  <div>
                                    <div style="padding: 20px; background-color: #010101; max-height: 90px">
                                      <img
                                        src="public/img/wayne_uni_logo.jpg"
                                        alt="{{bizName}}"
                                        style="height: 50px; object-fit: cover"
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <table
                            style="font-family: arial, helvetica, sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="overflow-wrap: break-word; word-break: break-word; padding: 10px; font-family: arial, helvetica, sans-serif"
                                  align="left"
                                >
                                  <div>
                                    <div style="padding: 10px 40px 40px">
                                      <h1 style="font-size: 28px; margin-bottom: 8px">You have received a new comment!</h1>
                                      <p style="font-size: 14px; margin-bottom: 12px">Hi ${data.receiver.name},</p>
                                      <p style="font-size: 14px; line-height: 1.6; margin-bottom: 10px">
                                        Your post has a new comment created by ${data.comment.isAnonymous ? 'Anonymous' : staff?.name}.
                                      </p>
                                    </div>
  
                                    <div style="background-color: #e6e6e6; height: 1px"></div>
  
                                    <p style="font-size: 14px; margin-top: 20px; margin-left: 12px">This is an automated email. Please do not reply.</p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <div class="u-row-container" style="padding: 0px; background-color: transparent">
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 640px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: transparent;
                  "
                >
                  <div style="border-collapse: collapse; display: table; width: 100%; height: 100%; background-color: transparent">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px;"><tr style="background-color: transparent;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="640" style="width: 640px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                    <div class="u-col u-col-100" style="max-width: 320px; min-width: 640px; display: table-cell; vertical-align: top">
                      <div style="height: 100%; width: 100% !important; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px">
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            box-sizing: border-box;
                            height: 100%;
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                            border-radius: 0px;
                            -webkit-border-radius: 0px;
                            -moz-border-radius: 0px;
                          "
                        ><!--<![endif]-->
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>
  </html>
     
      `;
};

export default commentTemplate;
