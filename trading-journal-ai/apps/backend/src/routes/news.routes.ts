import { Router, type Express } from 'express';
import { NewsController } from '../controllers/news.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router: Router = Router();
const newsController = new NewsController();

// Route để lấy tất cả tin tức thị trường
router.get('/', authMiddleware, newsController.getAllNews.bind(newsController));

// Route để lấy tin tức theo danh mục
router.get('/category/:category', authMiddleware, newsController.getNewsByCategory.bind(newsController));

// Route để tìm kiếm tin tức
router.get('/search', authMiddleware, newsController.searchNews.bind(newsController));

// Route để lấy tin tức theo ticker
router.get('/ticker/:ticker', authMiddleware, newsController.getNewsByTicker.bind(newsController));

// Route để cập nhật cấu hình API
router.post('/config', authMiddleware, newsController.updateApiConfig.bind(newsController));

// Route để kiểm tra trạng thái API
router.get('/status', authMiddleware, newsController.checkApiStatus.bind(newsController));

export { router as newsRoutes };
