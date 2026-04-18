import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

interface Person {
  name: string;
  amount: number;
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

@Component({
  selector: 'app-splitter',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './splitter.component.html',
  styleUrl: './splitter.component.scss'
})
export class SplitterComponent {
 inputText: string = '';
  results: Transaction[] = [];
  total = 0;
share: any = 0;

  calculate() {
  this.results = [];

  const people = this.parseInput(this.inputText);
  if (people.length === 0) return;

  const total = Math.round(
    people.reduce((sum, p) => sum + p.amount, 0)
  );

  const share = total / people.length;

  this.total = total;
  this.share = share.toFixed(2);

  let debtors: Person[] = [];
  let creditors: Person[] = [];

  people.forEach(p => {
    const diff = p.amount - share;

    if (diff > 0.01) {
      creditors.push({ name: p.name, amount: diff });
    } else if (diff < -0.01) {
      debtors.push({ name: p.name, amount: -diff });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i];
    const c = creditors[j];

    const pay = Math.min(d.amount, c.amount);
    const roundedPay = Number(pay.toFixed(2));  // ✅ ROUND ONCE

    if (roundedPay > 0) {
      this.results.push({
        from: d.name,
        to: c.name,
        amount: roundedPay
      });

      // ✅ IMPORTANT FIX
      d.amount = Number((d.amount - roundedPay).toFixed(2));
      c.amount = Number((c.amount - roundedPay).toFixed(2));
    }

    if (d.amount <= 0.01) i++;
    if (c.amount <= 0.01) j++;
  }
}
  parseInput(text: string) {
    const entries = text.split(',');
    let people: any[] = [];

    entries.forEach(entry => {
      const match = entry.match(/(\w+)\s*paid\s*(\d+)/i);
      if (match) {
        people.push({
          name: match[1],
          amount: Number(match[2])
        });
      }
    });

    return people;
  }
  getUpiLink(r: Transaction) {
  const upiId = "aniket@upi";
  return `upi://pay?pa=${upiId}&pn=${r.to}&am=${r.amount}&cu=INR`;
}
getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

getColor(name: string): string {
  const colors = ['#ff6b6b', '#4ecdc4', '#f7b731', '#5f27cd', '#1dd1a1'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}
pay(r: Transaction) {
  const upiId = "aniket@upi";
  const url = `upi://pay?pa=${upiId}&pn=${r.to}&am=${r.amount}&cu=INR`;
  window.open(url, '_blank');
}
}
