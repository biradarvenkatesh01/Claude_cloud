import sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import Paragraph, Table, TableStyle, Spacer, Frame, KeepTogether
from reportlab.lib.styles import ParagraphStyle

OUT = sys.argv[1]
LW, LH = landscape(A4)
PW, PH = A4

C_ENT = colors.HexColor("#CFE2F3")
C_BRIDGE = colors.HexColor("#D9D2E9")
C_DEP = colors.HexColor("#FFE599")
C_REL = colors.HexColor("#F4CCCC")
C_PK = colors.HexColor("#D9EAD3")
C_HEAD = colors.HexColor("#1F3B5C")
C_TH = colors.HexColor("#F4CCCC")
BORDER = colors.HexColor("#333333")
GREY = colors.HexColor("#555555")

FOOT = "CampusSwap - Student-to-Student Marketplace - DBMS Project"


class P:
    """Top-origin drawing helpers for one page."""
    def __init__(self, c, h):
        self.c, self.h = c, h

    def Y(self, y):
        return self.h - y

    def text(self, x, y, s, font="Helvetica", size=6, center=True, color=colors.black):
        c = self.c
        c.setFont(font, size)
        c.setFillColor(color)
        if center:
            c.drawCentredString(x, self.Y(y) - size * 0.35, s)
        else:
            c.drawString(x, self.Y(y) - size * 0.35, s)

    def line(self, x1, y1, x2, y2, w=0.7):
        c = self.c
        c.setStrokeColor(BORDER)
        c.setLineWidth(w)
        c.setDash()
        c.line(x1, self.Y(y1), x2, self.Y(y2))


# ---------------------------------------------------------------- ER diagram
ATTR_FS = 5.4


def oval_w(s):
    return stringWidth(s, "Helvetica", ATTR_FS) + 10


def er_page(c, stage):
    after = stage == "after"
    c.setPageSize((PW, PH))
    p = P(c, PH)
    header(p, PW)
    p.text(25, 74, ("4. Final Normalized ER Diagram (3NF)" if after
                    else "1. Entity-Relationship Diagram (before normalization)"),
           "Helvetica-Bold", 12, center=False, color=C_HEAD)

    ent = {}

    def entity(name, x, y, fill=C_ENT, w=None):
        w = w or max(78, stringWidth(name, "Helvetica-Bold", 6.6) + 18)
        h = 22
        ent[name] = (x, y, w, h)
        return (x, y, w, h)

    def edge_pt(name, side):
        x, y, w, h = ent[name]
        return {"l": (x - w / 2, y), "r": (x + w / 2, y), "t": (x, y - h / 2), "b": (x, y + h / 2),
                "tl": (x - w / 2 + 8, y - h / 2), "tr": (x + w / 2 - 8, y - h / 2),
                "bl": (x - w / 2 + 8, y + h / 2), "br": (x + w / 2 - 8, y + h / 2)}[side]

    fills = {}
    # ----- entity placement
    for n, x, y, f in [
        ("BRANCH", 75, 140, C_ENT), ("SEMESTER", 245, 140, C_ENT), ("CATEGORY", 515, 140, C_ENT),
        ("SUBJECT", 160, 240, C_ENT), ("PRODUCT", 390, 240, C_ENT),
        ("STUDENT", 115, 375, C_ENT), ("WISHLIST", 250, 315, C_BRIDGE), ("LISTING", 390, 375, C_ENT),
        ("EXCHANGE_REQUEST", 480, 535, C_BRIDGE),
        ("ORDERS", 250, 590, C_ENT), ("PAYMENT", 125, 695, C_DEP), ("REVIEW", 385, 695, C_DEP)]:
        entity(n, x, y)
        fills[n] = f

    attrs = []  # (label, kind, x, y, entity, side)

    def A(entname, side, items):
        for lab, kind, x, y in items:
            attrs.append((lab, kind, x, y, entname, side))

    pk, fk, at, cpk = "pk", "fk", "at", "cpk"
    A("BRANCH", "t", [("Branch_ID", pk, 45, 108), ("Branch_Name", at, 108, 108)])
    A("SEMESTER", "t", [("Semester_ID", pk, 212, 108), ("Semester_No", at, 280, 108)])
    A("CATEGORY", "t", [("Category_ID", pk, 482, 108), ("Category_Name", at, 548, 108)])
    A("SUBJECT", "l", [("Subject_ID", pk, 45, 216), ("Subject_Name", at, 45, 232),
                       ("Subject_Code", at, 45, 248), ("Branch_ID", fk, 45, 264), ("Semester_ID", fk, 45, 280)])
    A("PRODUCT", "t", [("Product_ID", pk, 318, 180), ("Title", at, 345, 197), ("Author", at, 372, 180),
                       ("Edition", at, 399, 197), ("Subject_ID", fk, 428, 180), ("Category_ID", fk, 452, 197)])
    A("STUDENT", "l", [("Student_ID", pk, 38, 327), ("Name", at, 38, 343), ("Email", at, 38, 359),
                       ("Phone", at, 38, 375), ("Password", at, 38, 391), ("Branch_ID", fk, 38, 407),
                       ("Semester_ID", fk, 38, 423)])
    if after:
        A("WISHLIST", "t", [("Student_ID", cpk, 205, 285), ("Listing_ID", cpk, 253, 285), ("Added_At", at, 298, 285)])
    else:
        A("WISHLIST", "t", [("Student_ID", fk, 200, 285), ("Listing_ID", fk, 245, 285), ("Added_At", at, 289, 285),
                            ("Listing_Price", at, 337, 285)])
    lst = [("Listing_ID", pk), ("Price", at), ("Condition", at), ("Status", at), ("Listed_At", at),
           ("Student_ID", fk), ("Product_ID", fk)]
    if not after:
        lst += [("Subject_ID", fk), ("Category_ID", fk)]
    y0 = 375 - (len(lst) - 1) * 16 / 2
    A("LISTING", "r", [(l, k, 510, y0 + i * 16) for i, (l, k) in enumerate(lst)])
    A("EXCHANGE_REQUEST", "spine", [("Request_ID", pk, 500, 562), ("Requester_ID", fk, 500, 578),
                                ("Target_Listing_ID", fk, 500, 594), ("Offered_Listing_ID", fk, 500, 610),
                                ("Status", at, 500, 626), ("Requested_At", at, 500, 642)])
    ordr = [("Order_ID", pk, 172, 532), ("Buyer_ID", fk, 197, 515), ("Listing_ID", fk, 222, 532),
            ("Order_Date", at, 250, 515), ("Amount", at, 278, 532), ("Status", at, 303, 515)]
    if not after:
        ordr.append(("Seller_ID", fk, 328, 532))
    A("ORDERS", "t", ordr)
    A("PAYMENT", "l", [("Payment_ID", pk, 40, 655), ("Order_ID", fk, 40, 671), ("Amount", at, 40, 687),
                       ("Payment_Method", at, 40, 703), ("Payment_Status", at, 40, 719), ("Paid_At", at, 40, 735)])
    A("REVIEW", "r", [("Review_ID", pk, 500, 672), ("Order_ID", fk, 500, 688), ("Rating", at, 500, 704),
                      ("Comment", at, 500, 720), ("Review_Date", at, 500, 736)])

    # attribute connector lines (drawn first)
    for lab, kind, x, y, en, side in attrs:
        ex, ey, w, h = ent[en]
        if side == "t":
            tx, ty = ex + max(-w / 2 + 6, min(w / 2 - 6, (x - ex) * 0.35)), ey - h / 2
        elif side == "b":
            tx, ty = ex + max(-w / 2 + 6, min(w / 2 - 6, (x - ex) * 0.35)), ey + h / 2
        elif side == "l":
            tx, ty = ex - w / 2, ey + max(-h / 2 + 3, min(h / 2 - 3, (y - ey) * 0.15))
        elif side == "br":
            tx, ty = ex + w / 2 - 10, ey + h / 2
        elif side == "spine":
            sxp = ex - w / 2 + 14
            p.line(sxp, ey + h / 2, sxp, y, 0.5)
            p.line(sxp, y, x, y, 0.5)
            continue
        else:
            tx, ty = ex + w / 2, ey + max(-h / 2 + 3, min(h / 2 - 3, (y - ey) * 0.15))
        p.line(x, y, tx, ty, 0.5)

    # relationships: (label, x, y, [(entity, side, card, (dx,dy) label offset)])
    rels = [
        ("has", 110, 190, [("BRANCH", "b", "1", (6, 9)), ("SUBJECT", "tl", "N", (-8, -6))]),
        ("offers", 210, 190, [("SEMESTER", "b", "1", (6, 9)), ("SUBJECT", "tr", "N", (8, -6))]),
        ("covers", 275, 240, [("SUBJECT", "r", "1", (6, -6)), ("PRODUCT", "l", "N", (-6, -6))]),
        ("classifies", 515, 205, [("CATEGORY", "b", "1", (6, 9)), ("PRODUCT", "r", "N", (6, -6))]),
        ("refers to", 390, 308, [("PRODUCT", "b", "1", (6, 8)), ("LISTING", "t", "N", (6, -7))]),
        ("creates", 250, 375, [("STUDENT", "r", "1", (6, -6)), ("LISTING", "l", "N", (-6, -6))]),
        ("adds", 168, 322, [("STUDENT", "tr", "1", (8, -4)), ("WISHLIST", "l", "N", (-6, -6))]),
        ("saved in", 328, 322, [("WISHLIST", "r", "N", (6, -6)), ("LISTING", "tl", "1", (-8, -4))]),
        ("requested in", 480, 470, [("LISTING", "br", "1", (8, 8)), ("EXCHANGE_REQUEST", "t", "N", (8, -7))]),
        ("places", 115, 470, [("STUDENT", "b", "1", (6, 8)), ("ORDERS", "l", "N", (-6, -6))]),
        ("sold in", 395, 470, [("LISTING", "b", "1", (-6, 8)), ("ORDERS", "r", "0/1", (8, -6))]),
        ("paid by", 175, 640, [("ORDERS", "bl", "1", (-8, 6)), ("PAYMENT", "tr", "1", (8, -5))]),
        ("gets", 320, 640, [("ORDERS", "br", "1", (8, 6)), ("REVIEW", "tl", "0/1", (-10, -5))]),
    ]
    dw, dh = 54, 24
    for lab, rx, ry, ends in rels:
        for en, side, card, (ox, oy) in ends:
            ex, ey = edge_pt(en, side)
            p.line(rx, ry, ex, ey, 0.8)
            p.text(ex + ox, ey + oy, card, "Helvetica-Bold", 6.5, color=colors.HexColor("#B00000"))
    for lab, rx, ry, ends in rels:
        w = max(dw, stringWidth(lab, "Helvetica", 5.6) + 26)
        path = c.beginPath()
        path.moveTo(rx - w / 2, p.Y(ry)); path.lineTo(rx, p.Y(ry - dh / 2))
        path.lineTo(rx + w / 2, p.Y(ry)); path.lineTo(rx, p.Y(ry + dh / 2)); path.close()
        c.setFillColor(C_REL); c.setStrokeColor(BORDER); c.setLineWidth(0.8); c.setDash()
        c.drawPath(path, fill=1, stroke=1)
        p.text(rx, ry, lab, "Helvetica", 5.6)

    for n, (x, y, w, h) in ent.items():
        c.setFillColor(fills[n]); c.setStrokeColor(BORDER); c.setLineWidth(0.9); c.setDash()
        c.rect(x - w / 2, p.Y(y + h / 2), w, h, fill=1, stroke=1)
        p.text(x, y, n, "Helvetica-Bold", 6.6)

    for lab, kind, x, y, en, side in attrs:
        draw_oval(p, lab, kind, x, y)

    # legend
    lx, ly, lw_, lh_ = 200, 722, 175, 78
    c.setStrokeColor(BORDER); c.setLineWidth(0.6); c.setDash(); c.setFillColor(colors.white)
    c.rect(lx, p.Y(ly + lh_), lw_, lh_, fill=1, stroke=1)
    p.text(lx + 6, ly + 9, "Legend", "Helvetica-Bold", 6.5, center=False)
    c.setFillColor(C_ENT); c.rect(lx + 8, p.Y(ly + 25), 16, 8, fill=1, stroke=1)
    p.text(lx + 30, ly + 21, "Entity", size=5.6, center=False)
    path = c.beginPath(); cx, cy = lx + 103, ly + 21
    path.moveTo(cx - 9, p.Y(cy)); path.lineTo(cx, p.Y(cy - 5)); path.lineTo(cx + 9, p.Y(cy)); path.lineTo(cx, p.Y(cy + 5)); path.close()
    c.setFillColor(C_REL); c.drawPath(path, fill=1, stroke=1)
    p.text(lx + 117, ly + 21, "Relationship", size=5.6, center=False)
    for i, (k, t) in enumerate([("pk", "Primary key"), ("fk", "Foreign key"),
                                ("cpk" if after else "at", "Composite PK + FK" if after else "Attribute"),
                                ("at" if after else None, "Attribute")]):
        if k is None:
            continue
        ox = lx + 16 if i % 2 == 0 else lx + 103
        oy = ly + 35 + (i // 2) * 13
        draw_oval(p, "", k, ox, oy, w=18)
        p.text(ox + 14, oy, t, size=5.6, center=False)
    c.setFillColor(C_BRIDGE); c.rect(lx + 8, p.Y(ly + 66), 8, 7, fill=1, stroke=1)
    c.setFillColor(C_DEP); c.rect(lx + 17, p.Y(ly + 66), 8, 7, fill=1, stroke=1)
    p.text(lx + 30, ly + 62, "Bridge / dependent entity", size=5.6, center=False)
    p.text(lx + 8, ly + 74, "1 = one    N = many    0/1 = zero or one", size=5.2, center=False, color=GREY)

    p.text(25, 89, "STUDENT also references BRANCH and SEMESTER (Branch_ID, Semester_ID). "
           "EXCHANGE_REQUEST also stores the requester (STUDENT) and the offered LISTING.",
           size=6, center=False, color=GREY)
    footer(p, PW, 1 if not after else 4)
    c.showPage()


def draw_oval(p, lab, kind, x, y, w=None):
    c = p.c
    w = w or oval_w(lab)
    h = 11
    c.setLineWidth(0.6)
    c.setStrokeColor(BORDER)
    if kind in ("pk", "cpk"):
        c.setFillColor(C_PK)
    else:
        c.setFillColor(colors.white)
    c.setDash(2, 1.5) if kind in ("fk", "cpk") else c.setDash()
    c.ellipse(x - w / 2, p.Y(y + h / 2), x + w / 2, p.Y(y - h / 2), fill=1, stroke=1)
    c.setDash()
    if lab:
        p.text(x, y, lab, "Helvetica", ATTR_FS)
        if kind in ("pk", "cpk"):
            tw = stringWidth(lab, "Helvetica", ATTR_FS)
            c.setLineWidth(0.4)
            c.line(x - tw / 2, p.Y(y + 2.6), x + tw / 2, p.Y(y + 2.6))


# ---------------------------------------------------------------- relational schema
def schema_page(c, stage):
    after = stage == "after"
    c.setPageSize((PW, PH))
    p = P(c, PH)
    header(p, PW)
    if after:
        p.text(25, 82, "5. Final Normalized Relational Schema (3NF)", "Helvetica-Bold", 12, center=False, color=C_HEAD)
        p.text(25, 97, "WISHLIST now uses a composite primary key and no longer stores Listing_Price; Subject_ID and "
               "Category_ID are removed", size=7, center=False)
        p.text(25, 107, "from LISTING and Seller_ID from ORDERS. All other tables are unchanged.", size=7, center=False)
    else:
        p.text(25, 82, "2. Relational Schema (before normalization)", "Helvetica-Bold", 12, center=False, color=C_HEAD)
        p.text(25, 97, "The ER diagram is mapped to twelve relations. These are the tables checked in the "
               "normalization process that follows.", size=7, center=False)

    PKc, FKc = "PK", "FK"
    T = {
        "BRANCH": [("Branch_ID", "PK"), ("Branch_Name", "")],
        "SUBJECT": [("Subject_ID", "PK"), ("Subject_Name", ""), ("Subject_Code", ""), ("Branch_ID", "FK"), ("Semester_ID", "FK")],
        "SEMESTER": [("Semester_ID", "PK"), ("Semester_No", "")],
        "PRODUCT": [("Product_ID", "PK"), ("Title", ""), ("Author", ""), ("Edition", ""), ("Subject_ID", "FK"), ("Category_ID", "FK")],
        "CATEGORY": [("Category_ID", "PK"), ("Category_Name", "")],
        "STUDENT": [("Student_ID", "PK"), ("Name", ""), ("Email", ""), ("Phone", ""), ("Password", ""), ("Branch_ID", "FK"), ("Semester_ID", "FK")],
        "WISHLIST": ([("Student_ID", "PK, FK"), ("Listing_ID", "PK, FK"), ("Added_At", "")] if after else
                     [("Student_ID", "FK"), ("Listing_ID", "FK"), ("Added_At", ""), ("Listing_Price", "")]),
        "LISTING": [("Listing_ID", "PK"), ("Student_ID", "FK"), ("Product_ID", "FK")] +
                   ([] if after else [("Subject_ID", "FK"), ("Category_ID", "FK")]) +
                   [("Price", ""), ("Condition", ""), ("Status", ""), ("Listed_At", "")],
        "EXCHANGE_REQUEST": [("Request_ID", "PK"), ("Requester_ID", "FK"), ("Target_Listing_ID", "FK"),
                             ("Offered_Listing_ID", "FK"), ("Status", ""), ("Requested_At", "")],
        "PAYMENT": [("Payment_ID", "PK"), ("Order_ID", "FK"), ("Amount", ""), ("Payment_Method", ""), ("Payment_Status", ""), ("Paid_At", "")],
        "ORDERS": [("Order_ID", "PK"), ("Buyer_ID", "FK"), ("Listing_ID", "FK")] + ([] if after else [("Seller_ID", "FK")]) +
                  [("Order_Date", ""), ("Amount", ""), ("Status", "")],
        "REVIEW": [("Review_ID", "PK"), ("Order_ID", "FK"), ("Rating", ""), ("Comment", ""), ("Review_Date", "")],
    }
    W = 160
    cols = [25, 217, 409]
    pos = {"BRANCH": (0, 128), "SEMESTER": (1, 128), "SUBJECT": (2, 128),
           "CATEGORY": (1, 238), "PRODUCT": (2, 238),
           "STUDENT": (0, 358), "WISHLIST": (1, 358), "LISTING": (2, 358),
           "ORDERS": (1, 525), "EXCHANGE_REQUEST": (2, 525),
           "PAYMENT": (0, 665), "REVIEW": (1, 665)}
    HH, RH = 14, 11.5
    box = {}
    for n, (ci, top) in pos.items():
        box[n] = (cols[ci], top, W, HH + RH * len(T[n]))

    def side(n, s, off):
        x, top, w, h = box[n]
        return {"t": (x + off, top), "b": (x + off, top + h), "l": (x, top + off), "r": (x + w, top + off)}[s]

    conns = [
        ([side("BRANCH", "t", 80), (105, 116), (489, 116), side("SUBJECT", "t", 80)], "1", "N"),
        ([side("SEMESTER", "r", 40), side("SUBJECT", "l", 40)], "1", "N"),
        ([side("SUBJECT", "b", 80), side("PRODUCT", "t", 80)], "1", "N"),
        ([side("CATEGORY", "r", 30), side("PRODUCT", "l", 30)], "1", "N"),
        ([side("BRANCH", "b", 40), side("STUDENT", "t", 40)], "1", "N"),
        ([side("SEMESTER", "b", 45), (262, 218), (145, 218), side("STUDENT", "t", 120)], "1", "N"),
        ([side("PRODUCT", "b", 80), side("LISTING", "t", 80)], "1", "N"),
        ([side("STUDENT", "t", 140), (165, 342), (430, 342), side("LISTING", "t", 21)], "1", "N"),
        ([side("STUDENT", "r", 30), side("WISHLIST", "l", 30)], "1", "N"),
        ([side("LISTING", "l", 30), side("WISHLIST", "r", 30)], "1", "N"),
        ([side("LISTING", "b", 80), side("EXCHANGE_REQUEST", "t", 80)], "1", "N"),
        ([side("LISTING", "b", 25), (434, 505), (297, 505), side("ORDERS", "t", 80)], "1", "0/1"),
        ([side("STUDENT", "b", 40), (65, 565), side("ORDERS", "l", 40)], "1", "N"),
        ([side("ORDERS", "l", 75), (145, 600), side("PAYMENT", "t", 120)], "1", "1"),
        ([side("ORDERS", "b", 80), side("REVIEW", "t", 80)], "1", "0/1"),
    ]
    c.setLineWidth(0.7)
    for cn in conns:
        pts, a, b = cn
        c.setStrokeColor(BORDER); c.setDash()
        for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
            p.line(x1, y1, x2, y2, 0.7)
        arrow(p, pts[1], pts[0]); arrow(p, pts[-2], pts[-1])
        for (ex, ey), (nx, ny), lab in [(pts[0], pts[1], a), (pts[-1], pts[-2], b)]:
            if ex == nx:  # vertical end
                lx_, ly_ = ex + 5, ey + (8 if ny > ey else -8)
                p.text(lx_, ly_, lab, "Helvetica-Bold", 6.5, center=False)
            else:
                d = 1 if nx > ex else -1
                p.text(ex + d * 9 - (stringWidth(lab, "Helvetica-Bold", 6.5) if d < 0 else 0) + (0 if d < 0 else -2),
                       ey - 7, lab, "Helvetica-Bold", 6.5, center=False)

    for n, (x, top, w, h) in box.items():
        c.setStrokeColor(BORDER); c.setLineWidth(0.8); c.setDash()
        c.setFillColor(colors.white); c.rect(x, p.Y(top + h), w, h, fill=1, stroke=1)
        c.setFillColor(C_TH); c.rect(x, p.Y(top + HH), w, HH, fill=1, stroke=1)
        p.text(x + w / 2, top + HH / 2, n, "Helvetica-Bold", 6.8)
        for i, (col, key) in enumerate(T[n]):
            yy = top + HH + RH * i + RH / 2
            bold = "PK" in key
            p.text(x + 5, yy, col, "Helvetica-Bold" if bold else "Helvetica", 6.2, center=False)
            if bold:
                tw = stringWidth(col, "Helvetica-Bold", 6.2)
                c.setLineWidth(0.5); c.line(x + 5, p.Y(yy + 3.2), x + 5 + tw, p.Y(yy + 3.2))
            if key:
                p.text(x + w - 4 - stringWidth(key, "Helvetica", 5), yy, key, "Helvetica", 5, center=False, color=GREY)
            if i:
                c.setStrokeColor(colors.HexColor("#DDDDDD")); c.setLineWidth(0.3)
                c.line(x, p.Y(top + HH + RH * i), x + w, p.Y(top + HH + RH * i))

    p.text(25, 785, "PK = primary key (underlined)    FK = foreign key    Arrows join the parent table (1 side) to the "
           "child table (N side).", size=6, center=False, color=GREY)
    p.text(25, 796, "EXCHANGE_REQUEST.Requester_ID references STUDENT and Offered_Listing_ID references LISTING; "
           "ORDERS.Buyer_ID references STUDENT.", size=6, center=False, color=GREY)
    footer(p, PW, 5 if after else 2)
    c.showPage()


def arrow(p, frm, to):
    c = p.c
    (x1, y1), (x2, y2) = frm, to
    import math
    ang = math.atan2(-(y2 - y1), x2 - x1)
    L, a = 4, 0.45
    X, Y = x2, p.Y(y2)
    path = c.beginPath()
    path.moveTo(X, Y)
    path.lineTo(X - L * math.cos(ang - a), Y - L * math.sin(ang - a))
    path.lineTo(X - L * math.cos(ang + a), Y - L * math.sin(ang + a))
    path.close()
    c.setFillColor(BORDER)
    c.drawPath(path, fill=1, stroke=0)


# ---------------------------------------------------------------- normalization page
def norm_page(c):
    c.setPageSize((PW, PH))
    p = P(c, PH)
    body = ParagraphStyle("b", fontName="Helvetica", fontSize=7.4, leading=9.6)
    h1 = ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=C_HEAD, spaceAfter=6)
    h2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=10.5, leading=13, textColor=C_HEAD, spaceBefore=8, spaceAfter=6)
    bul = ParagraphStyle("bu", parent=body, leftIndent=9, bulletIndent=0)
    nfh = ParagraphStyle("nfh", fontName="Helvetica-Bold", fontSize=8.6, leading=11)
    stat = ParagraphStyle("st", fontName="Helvetica-Bold", fontSize=10, alignment=1, leading=12)
    cell = ParagraphStyle("c", fontName="Helvetica", fontSize=7.2, leading=9)
    cellb = ParagraphStyle("cb", parent=cell, fontName="Helvetica-Bold")

    def nf(title, status, color, points):
        bl = [Paragraph(pt, bul, bulletText="•") for pt in points]
        t = Table([[Paragraph(title, nfh), ""], [Paragraph(status, stat), bl]], colWidths=[66, 444])
        t.setStyle(TableStyle([
            ("SPAN", (0, 0), (1, 0)), ("BACKGROUND", (0, 0), (1, 0), color), ("BACKGROUND", (0, 1), (0, 1), color),
            ("BOX", (0, 0), (-1, -1), 0.7, BORDER), ("LINEBELOW", (0, 0), (-1, 0), 0.7, BORDER),
            ("LINEAFTER", (0, 1), (0, 1), 0.7, BORDER), ("VALIGN", (0, 1), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]))
        return t

    story = [
        Paragraph("3. Normalization Process", h1),
        Paragraph("Each of the twelve relations from Section 2 is tested against the normal forms in order, from 1NF to "
                  "5NF. Only three tables needed a change (WISHLIST, LISTING and ORDERS); the rest were already in 3NF.", body),
        Spacer(1, 8),
        nf("1NF - First Normal Form", "Applied", colors.HexColor("#D9EAD3"), [
            "All attributes hold atomic (single) values; there are no repeating groups or multivalued attributes.",
            "The many listings a student saves are stored as separate rows in the bridge table WISHLIST, and every copy "
            "a student sells is a separate row in LISTING, instead of storing lists in a single field of STUDENT.",
            "<b>Change:</b> WISHLIST had no primary key (Student_ID and Listing_ID were only foreign keys), so the same "
            "listing could be saved twice by one student. The composite primary key (Student_ID, Listing_ID) is added.",
        ]),
        nf("2NF - Second Normal Form", "Applied", colors.HexColor("#FFF2CC"), [
            "Checked only for tables with a composite key: WISHLIST. All other tables have a single-column primary key, "
            "so they cannot have a partial dependency.",
            "WISHLIST(Student_ID, Listing_ID) -> Added_At depends on the whole key (when this student saved this listing).",
            "<b>Change:</b> Listing_Price depended only on Listing_ID (a partial dependency) and was repeated for every "
            "student who saved the same listing, causing update anomalies. It is removed; the price is read from LISTING.Price.",
        ]),
        nf("3NF - Third Normal Form", "Applied", colors.HexColor("#F4CCCC"), [
            "<b>Change:</b> LISTING stored Subject_ID and Category_ID. Since Listing_ID -> Product_ID -> Subject_ID, "
            "Category_ID, this is a transitive dependency. Both are removed and are obtained through PRODUCT.",
            "<b>Change:</b> ORDERS stored Seller_ID. Since Order_ID -> Listing_ID -> Student_ID (the seller), this is "
            "transitive. Seller_ID is removed; the seller is found through LISTING.Student_ID.",
            "Subject_Name and Subject_Code depend only on Subject_ID; Branch_Name only on Branch_ID; Title, Author and "
            "Edition only on Product_ID; Name, Email, Phone and Password only on Student_ID.",
            "Amount in ORDERS is kept as a stored value (the price at the time of sale), so it depends only on Order_ID.",
        ]),
        nf("4NF - Fourth Normal Form", "N/A", colors.HexColor("#D9D2E9"), [
            "No independent multivalued dependencies remain: a student's wishlist and a student's own listings are "
            "already stored in the separate tables WISHLIST and LISTING.",
            "Hence 4NF needs no further change.",
        ]),
        nf("5NF - Fifth Normal Form", "N/A", colors.HexColor("#CFE2F3"), [
            "No non-trivial join dependencies remain. The many-to-many STUDENT-LISTING relationship is resolved by "
            "WISHLIST, and EXCHANGE_REQUEST stores the target and offered listings in one row.",
            "Hence 5NF needs no further change.",
        ]),
        Paragraph("Summary of changes", h2),
    ]
    rows = [["Table", "Before", "After", "Normal form"],
            ["WISHLIST", "Student_ID and Listing_ID were foreign keys only; no primary key",
             "Composite PK (Student_ID, Listing_ID), both also FK", "1NF"],
            ["WISHLIST", "Listing_Price stored (depends only on Listing_ID)", "Listing_Price removed; read from LISTING", "2NF"],
            ["LISTING", "Subject_ID and Category_ID stored (via Product_ID)", "Both removed; read through PRODUCT", "3NF"],
            ["ORDERS", "Seller_ID stored (via Listing_ID)", "Seller_ID removed; seller = LISTING.Student_ID", "3NF"],
            ["All other tables", "-", "Unchanged; already in 3NF", "3NF"]]
    data = [[Paragraph(x, cellb if i == 0 else cell) for x in r] for i, r in enumerate(rows)]
    t = Table(data, colWidths=[90, 165, 195, 60])
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.6, BORDER), ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#CFE2F3")),
                           ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 3),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    story.append(t)
    story = [x for s_ in story for x in ([s_, Spacer(1, 7)] if isinstance(s_, Table) and s_ is not t else [s_])]
    f = Frame(42, 34, PW - 84, PH - 70, showBoundary=0, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    f.addFromList(story, c)
    if story:
        raise SystemExit("page 3 overflow: %d left %r" % (len(story), [type(s).__name__ for s in story]))
    footer(p, PW, 3)
    c.showPage()


def header(p, W):
    p.text(W / 2, 26, "CAMPUSSWAP - STUDENT MARKETPLACE MANAGEMENT SYSTEM", "Helvetica-Bold", 14)
    p.text(W / 2, 41, "Second-Hand Books and Study Equipment - ER Diagram, Relational Schema and Normalization",
           size=7.5, color=GREY)
    s = [("Name: ", "Sharvari H D"), ("   USN: ", "U25UV24T029099"), ("   Class: ", "3rd Year, CSE"),
         ("   Subject: ", "DBMS")]
    total = sum(stringWidth(a, "Helvetica-Bold", 7.5) + stringWidth(b, "Helvetica", 7.5) for a, b in s)
    x = W / 2 - total / 2
    for a, b in s:
        p.text(x, 54, a, "Helvetica-Bold", 7.5, center=False); x += stringWidth(a, "Helvetica-Bold", 7.5)
        p.text(x, 54, b, "Helvetica", 7.5, center=False); x += stringWidth(b, "Helvetica", 7.5)


def footer(p, W, n):
    H = p.h
    p.text(40, H - 16, FOOT, size=6.5, center=False, color=GREY)
    p.text(W - 40, H - 16, f"Page {n}", size=6.5, center=False, color=GREY)


def main():
    c = canvas.Canvas(OUT)
    c.setTitle("CampusSwap - ER Diagram, Relational Schema and Normalization")
    c.setAuthor("Sharvari H D")
    er_page(c, "before")
    schema_page(c, "before")
    norm_page(c)
    er_page(c, "after")
    schema_page(c, "after")
    c.save()


main()
