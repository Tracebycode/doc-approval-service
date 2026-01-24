import nodemailer from 'nodemailer';
import { PostTypes} from '../types/posts';


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


export class EmailService{
   
    static async sendApproveEmail(post:PostTypes){
         const approveLink = `${process.env.BaseURL}/post/${post.id}/approve`;
         const rejectLink = `${process.env.BaseURL}/post/${post.id}/reject`;

    
        const transporter = createTransporte();

        await transporter.verify();
        console.log("SMTP ready");
          const snippet =
      post.content.length > 100
        ? post.content.substring(0, 100) + "..."
        : post.content;

        const mailOptions = {
            from: `"Doc Approval Service" <${process.env.SMTP_USER}>`,
            to: process.env.managerEmail,
            subject: "Post Approval Request",
            html:`
             <h2>${post.title}</h2>
             <img src="${post.image}" alt="Post Image"/>
        <p><strong>Summary:</strong></p>
        <p>${snippet}</p>
        <br/>
        <a href="${approveLink}">✅ Approve</a>
        &nbsp;&nbsp;
        <a href="${rejectLink}">❌ Reject</a>
            `
        };
        const mail = await transporter.sendMail(mailOptions);
    }


    
}

