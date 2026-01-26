import nodemailer from 'nodemailer';
import { PostTypes} from '../types/posts';


// ---- EMAIL SERVICE ----
function createTransporte(){
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })
}

function isSmtpConfigured() {
  return (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  );
}



// ---- EMAIL SERVICE ----
export class EmailService {
  static async sendApproveEmail(post: PostTypes) {
    const approveLink = `${process.env.BaseURL}/api/posts/approve?post_id=${post.id}`;
    const rejectLink  = `${process.env.BaseURL}/api/posts/reject?post_id=${post.id}`;


    //configuration check
     if (!isSmtpConfigured()) {
      console.log("📌 SMTP not configured. Approval links:");
      console.log("1. Approve:", approveLink);
      console.log("2. Reject :", rejectLink);
      return;
    }

    const transporter = createTransporte();
    await transporter.verify();

    const snippet =
      post.content.length > 1000
        ? post.content.substring(0, 1000) + "..."
        : post.content;

    const imageHtml =
      post.image && post.image.startsWith("http")
        ? `<img src="${post.image}" style="max-width:300px"/><br/>`
        : "";

    await transporter.sendMail({
      from: `"Doc Approval Service" <${process.env.SMTP_USER}>`,
      to: process.env.managerEmail,
      subject: "Post Approval Request",
      html: `
        <h2>${post.title}</h2>
        ${imageHtml}
        <p><strong>Summary:</strong></p>
        <p>${snippet}</p>
        <br/>
        <a href="${approveLink}">✅ Approve</a>
        &nbsp;&nbsp;
        <a href="${rejectLink}">❌ Reject</a>
      `,
    });
  }
}

