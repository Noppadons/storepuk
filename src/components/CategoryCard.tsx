import { Category } from '@/types';
import Link from 'next/link';

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={`/category/${category.slug}`}
            className="flex flex-col items-center gap-2 group"
        >
            <div className="category-icon group-hover:shadow-lg group-hover:scale-110 transition-all duration-200">
                <span>{category.icon}</span>
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {category.nameTh}
            </span>
        </Link>
    );
}
