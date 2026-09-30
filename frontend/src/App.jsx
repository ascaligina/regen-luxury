import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Protetta from "./components/Protetta.jsx";
import HomePage from "./pages/HomePage.jsx";
import ArmadioPage from "./pages/ArmadioPage.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";
import SunPage from "./pages/SunPage.jsx";
import ScanPage from "./pages/ScanPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import NewItemPage from "./pages/NewItemPage.jsx";
import ItemDetailPage from "./pages/ItemDetailPage.jsx";
import LabelPage from "./pages/LabelPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Area pubblica (consumatore): nessun login */}
        <Route index element={<HomePage />} />
        <Route path="v/:tagId" element={<VerifyPage />} />
        <Route path="s" element={<SunPage />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="armadio" element={<ArmadioPage />} />
        <Route path="login" element={<LoginPage />} />

        {/* Area gestionale (commercianti, artigiani, brand manager) */}
        <Route path="gestione" element={<Protetta />}>
          <Route index element={<DashboardPage />} />
          <Route path="nuovo" element={<Protetta ruoli={["brand_manager", "commerciante"]} />}>
            <Route index element={<NewItemPage />} />
          </Route>
          <Route path="capi/:id" element={<ItemDetailPage />} />
          <Route path="capi/:id/etichetta" element={<LabelPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="utenti" element={<Protetta ruoli={["admin"]} />}>
            <Route index element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
