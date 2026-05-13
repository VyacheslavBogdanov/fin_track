import {
	LayoutDashboard,
	Receipt,
	Wallet,
	BarChart3,
	Settings,
	type LucideIcon,
} from 'lucide-vue-next';

export interface NavItem {
	name: string;
	label: string;
	icon: LucideIcon;
}

export const navItems: NavItem[] = [
	{ name: 'Dashboard', label: 'Дашборд', icon: LayoutDashboard },
	{ name: 'Transactions', label: 'Транзакции', icon: Receipt },
	{ name: 'Budget', label: 'Бюджеты', icon: Wallet },
	{ name: 'Reports', label: 'Отчёты', icon: BarChart3 },
	{ name: 'Settings', label: 'Настройки', icon: Settings },
];
