/**
 * Run this once to promote a user to admin:
 *   node make-admin.js your@email.com
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const email = process.argv[2];
if (!email) {
    console.error('Usage: node make-admin.js <email>');
    process.exit(1);
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate(
        { email },
        { role: 'admin' },
        { new: true }
    );
    if (!user) {
        console.error(`❌ No user found with email: ${email}`);
    } else {
        console.log(`✅ ${user.name} (${user.email}) is now an admin!`);
    }
    await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
