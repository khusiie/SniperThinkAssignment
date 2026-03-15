"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
require("./workers/file.worker"); // Start the worker
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', upload_routes_1.default);
// Part 1: Simple Interest API
app.post('/api/interest', async (req, res) => {
    const { name, email, step } = req.body;
    if (!name || !email || !step) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const interest = await prisma.interest.create({
            data: { name, email, step }
        });
        res.status(200).json({ message: 'Interest recorded successfully', id: interest.id });
    }
    catch (error) {
        console.error('Interest Error:', error);
        res.status(500).json({ error: 'Failed to record interest' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map