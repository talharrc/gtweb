import { Routes, Route } from 'react-router-dom';
import SpaceLayout from './SpaceLayout';
import RequireSpaceAuth from './RequireSpaceAuth';
import AdminGate from './AdminGate';
import SpaceFeedPage from '../../pages/space/SpaceFeedPage';
import SpaceCategoryPage from '../../pages/space/SpaceCategoryPage';
import PostDetailPage from '../../pages/space/PostDetailPage';
import CreatePostPage from '../../pages/space/CreatePostPage';
import ProfilePage from '../../pages/space/ProfilePage';
import BookmarksPage from '../../pages/space/BookmarksPage';
import SpaceLoginPage from '../../pages/space/SpaceLoginPage';
import SpaceSignupPage from '../../pages/space/SpaceSignupPage';
import SpaceAdminPage from '../../pages/space/SpaceAdminPage';

export default function SpaceRoutes() {
  return (
    <Routes>
      <Route element={<SpaceLayout />}>
        <Route path="/space" element={<SpaceFeedPage />} />
        <Route path="/space/login" element={<SpaceLoginPage />} />
        <Route path="/space/signup" element={<SpaceSignupPage />} />
        <Route path="/space/post/:id" element={<PostDetailPage />} />
        <Route path="/space/profile/:username" element={<ProfilePage />} />
        <Route
          path="/space/create"
          element={
            <RequireSpaceAuth>
              <CreatePostPage />
            </RequireSpaceAuth>
          }
        />
        <Route
          path="/space/bookmarks"
          element={
            <RequireSpaceAuth>
              <BookmarksPage />
            </RequireSpaceAuth>
          }
        />
        <Route
          path="/space/admin"
          element={
            <AdminGate>
              <SpaceAdminPage />
            </AdminGate>
          }
        />
        <Route path="/space/:category" element={<SpaceCategoryPage />} />
      </Route>
    </Routes>
  );
}
