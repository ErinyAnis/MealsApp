'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from './nav-link.module.css';

export default function NavLink({ href, children }) {
  const pathname = usePathname();

  const isActive = (pathname, href) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href) && (pathname === href || pathname[href.length] === '/' || pathname.length === href.length);
  };

  const linkClassName = isActive(pathname, href) ? `${classes.active} ${classes.link}` : classes.link;

  return (
    <Link href={href} passHref className={classes.parentLink}>
      <div className={linkClassName}>
        {children}
      </div>
    </Link>
  );
}
